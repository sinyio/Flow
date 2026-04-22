"use client";

import { useRef, useState, useEffect, use } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { isAxiosError } from "axios";
import { Button, Icon, Text, useToaster } from "@gravity-ui/uikit";
import { Paperclip, Xmark } from "@gravity-ui/icons";
import Image from "next/image";
import { useRouter } from "next/navigation";

import { patchPost } from "@api/media/patch-post";
import { getPostById } from "@api/media/get-post-by-id";
import { useApiContext } from "@contexts/api-context";
import { useCurrentUserStore } from "@utils/stores/current-user";
import { ArrowIcon } from "@components/svgr/arrow-icon/icon";
import { TextField } from "@components/form/text-field/field";
import { TextAreaField } from "@components/form/text-area-field/field";
import { PageContainer } from "@components/global/page-container";

import { normalizeContent } from "@utils/normalize-content";
import styles from "../../new/page.module.css";

const CONTENT_MAX = 10_000;

const schema = z.object({
  title: z.string().min(1, "Введите заголовок").max(200),
  content: z.string().max(CONTENT_MAX, `Максимум ${CONTENT_MAX.toLocaleString()} символов`).optional(),
});

type TFormValues = z.infer<typeof schema>;

interface EditPostPageProps {
  params: Promise<{ id: string }>;
}

export default function EditPostPage({ params }: EditPostPageProps) {
  const { id } = use(params);
  const router = useRouter();
  const { apiClient } = useApiContext();
  const { add } = useToaster();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [existingImage, setExistingImage] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  const { fetch: fetchCurrentUser } = useCurrentUserStore();

  const { control, handleSubmit, formState, reset, watch } = useForm<TFormValues>({
    defaultValues: { title: "", content: "" },
    mode: "onChange",
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    let cancelled = false;

    Promise.all([
      fetchCurrentUser(apiClient),
      getPostById(id, apiClient),
    ])
      .then(([userId, postRes]) => {
        if (cancelled) return;

        const postData = postRes.data;

        if (!userId) {
          router.replace("/media");
          return;
        }

        if (!("id" in postData)) {
          router.replace("/media");
          return;
        }

        if (postData.author?.id !== userId) {
          router.replace("/media");
          return;
        }

        reset({ title: postData.title, content: normalizeContent(postData.content) ?? "" });
        setExistingImage(postData.image);
      })
      .catch(() => {
        if (!cancelled) router.replace("/media");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [id, apiClient, router, reset]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImage(file);
    setPreview(URL.createObjectURL(file));
    setExistingImage(null);
    e.target.value = "";
  };

  const removeImage = () => {
    setImage(null);
    setExistingImage(null);
    if (preview) URL.revokeObjectURL(preview);
    setPreview(null);
  };

  const onSubmit: SubmitHandler<TFormValues> = async (data) => {
    setSubmitting(true);
    try {
      const { data: body } = await patchPost(
        { id, title: data.title, content: normalizeContent(data.content), image: image ?? undefined },
        apiClient,
      );

      if ("status" in body && body.status === "ok") {
        add({
          isClosable: true,
          theme: "success",
          name: "edit_post_success",
          title: "Пост обновлён",
        });
        router.push(`/media/posts/${id}`);
        return;
      }

      add({
        isClosable: true,
        theme: "warning",
        name: "edit_post_error",
        title: "Ошибка",
        content: "message" in body ? body.message : "Не удалось обновить пост",
      });
    } catch (error) {
      let message = "Произошла ошибка при обновлении";
      if (isAxiosError(error)) {
        const err = error.response?.data as { message?: string } | undefined;
        message = err?.message ?? error.message ?? message;
      }
      add({ isClosable: true, theme: "warning", name: "edit_post_error", title: "Ошибка", content: message });
    } finally {
      setSubmitting(false);
    }
  };

  const currentPreview = preview ?? existingImage;

  if (loading) {
    return (
      <PageContainer>
        <div style={{ padding: "48px 16px" }}>
          <Text variant="body-2" color="secondary">
            Загрузка...
          </Text>
        </div>
      </PageContainer>
    );
  }

  return (
    <>
      <div className={styles.gap} />

      <PageContainer inner={{ className: styles.page }}>
        <div className={styles.headerRow}>
          <Button
            view="normal"
            size="l"
            className={styles.backButton}
            aria-label="Назад"
            onClick={() => router.push(`/media/posts/${id}`)}
          >
            <Icon data={ArrowIcon} />
          </Button>

          <Text variant="display-3" className={styles.title}>
            Редактировать пост
          </Text>
        </div>

        <div className={styles.divider} />

        <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
          <div className={styles.section}>
            <Text variant="header-2">Напишите свою историю</Text>
            <div className={styles.fields}>
              <TextField
                size="xl"
                placeholder="Заголовок"
                controllerProps={{ control, name: "title" }}
              />
              <TextAreaField
                size="xl"
                placeholder="Ваш текст"
                minRows={6}
                controllerProps={{ control, name: "content" }}
                note={(watch("content")?.length ?? 0) > CONTENT_MAX * 0.8
                  ? `${watch("content")?.length ?? 0} / ${CONTENT_MAX.toLocaleString()}`
                  : undefined}
              />
            </div>
          </div>

          <div className={styles.section}>
            <Text variant="header-2">Обложка</Text>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className={styles.hiddenInput}
              onChange={handleFileChange}
            />
            {currentPreview ? (
              <div className={styles.previewWrapper}>
                <Image src={currentPreview} alt="Обложка" fill className={styles.previewImage} />
                <button type="button" className={styles.removeImage} onClick={removeImage}>
                  <Xmark width={16} height={16} />
                </button>
              </div>
            ) : (
              <Button
                type="button"
                view="action"
                size="xl"
                className={styles.uploadButton}
                onClick={() => fileInputRef.current?.click()}
              >
                <Paperclip width={16} height={16} />
                Добавить фото
              </Button>
            )}
          </div>

          <div className={styles.submitBlock}>
            <Button
              type="submit"
              size="xl"
              view="action"
              className={styles.submitButton}
              disabled={!formState.isValid || submitting}
              loading={submitting}
            >
              Сохранить
            </Button>
          </div>
        </form>
      </PageContainer>
    </>
  );
}
