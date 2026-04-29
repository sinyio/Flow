"use client";

import type { TCreateAdFormValues } from "./types";
import { Button, Switch, Text } from "@gravity-ui/uikit";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";

import { getPopularRoutes, TPackaging } from "@api/ads";
import { useAxiosInstance } from "@api/use-axios-instance";

import { useCreateAdDraftStore } from "@utils/stores/create-ad-draft/store";

import { DatePickerField } from "@components/form/date-picker-field/field";
import { ImageUploadPreview } from "@components/form/image-upload";
import { SelectField } from "@components/form/select-field/field";
import { TextAreaField } from "@components/form/text-area-field/field";
import { TextField } from "@components/form/text-field/field";

import styles from "./component.module.css";
import { createAdSchema } from "./validation-schema";

const packagingOptions: Array<{ value: TPackaging; content: string }> = [
  { value: "BOX", content: "Коробка" },
  { value: "PACKAGE", content: "Пакет" },
  { value: "ENVELOPE", content: "Конверт" },
  { value: "FILM", content: "Плёнка" },
  { value: "NO_PACKAGING", content: "Без упаковки" },
  { value: "OTHER", content: "Другое" },
];

const toRouteKey = (fromCity: string, toCity: string) =>
  `${fromCity}__${toCity}`;

export const CreateAdForm = () => {
  const axiosInstance = useAxiosInstance();
  const router = useRouter();
  const { save, values: storedValues, previewUrl: storedPreviewUrl } = useCreateAdDraftStore();

  const [routes, setRoutes] = useState<
    Array<{ value: string; content: string }>
  >([]);
  const [preview, setPreview] = useState<string | null>(storedPreviewUrl);

  const { control, handleSubmit, setValue, watch, formState } =
    useForm<TCreateAdFormValues>({
      defaultValues: storedValues ?? {
        routeKey: "",
        startDate: "",
        endDate: "",
        title: "",
        role: "sender",
        isDocument: false,
        isFragile: true,
        packaging: "",
        weight: "",
        length: "",
        width: "",
        height: "",
        price: "",
        description: "",
        image: null,
      },
      mode: "onChange",
      resolver: zodResolver(createAdSchema) as never,
    });

  const role = watch("role");

  const handleFileSelect = (file: File) => {
    if (preview) URL.revokeObjectURL(preview);
    setValue("image", file, { shouldValidate: true });
    setPreview(URL.createObjectURL(file));
  };

  const handleRemove = () => {
    if (preview) URL.revokeObjectURL(preview);
    setValue("image", null, { shouldValidate: true });
    setPreview(null);
  };

  useEffect(() => {
    let alive = true;

    getPopularRoutes(axiosInstance)
      .then((res) => {
        const data = res.data;

        if (!alive) return;

        if (Array.isArray(data)) {
          setRoutes(
            data.map((r) => ({
              value: toRouteKey(r.fromCity, r.toCity),
              content: `${r.fromCity} – ${r.toCity}`,
            })),
          );
        }
      })
      .catch((err) => {
        console.error("[CreateAdForm] getPopularRoutes failed:", err);
      });

    return () => {
      alive = false;
    };
  }, [axiosInstance]);

  const onSubmit: SubmitHandler<TCreateAdFormValues> = (values) => {
    const [fromCity, toCity] = values.routeKey.split("__");
    if (!fromCity || !toCity || !values.image) return;

    save(values, preview);
    router.push("/ads/preview");
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
      <div className={styles.section}>
        <Text variant="header-2" className={styles.sectionTitle}>
          Главное о задании
        </Text>

        <div className={styles.fields}>
          <SelectField
            label="Направление:"
            placeholder="Выберите маршрут"
            options={routes}
            controllerProps={{ control, name: "routeKey" }}
            width="max"
          />

          <div className={styles.datesRow}>
            <DatePickerField
              label="Дата начала:"
              controllerProps={{ control, name: "startDate" }}
              placeholder="ДД.ММ.ГГГГ"
            />
            <DatePickerField
              label="Дата окончания:"
              controllerProps={{ control, name: "endDate" }}
              placeholder="ДД.ММ.ГГГГ"
            />
          </div>

          <TextField
            label="Название:"
            placeholder="Например: кроссовки"
            controllerProps={{ control, name: "title" }}
          />
        </div>
      </div>

      <div className={styles.section}>
        <Text variant="header-2" className={styles.sectionTitle}>
          Ваша роль
        </Text>

        <div className={styles.roleGroup} role="tablist" aria-label="Ваша роль">
          <div
            className={[
              styles.roleButton,
              role === "sender" ? styles.roleButtonActive : undefined,
            ].join(" ")}
            onClick={() => setValue("role", "sender", { shouldValidate: true })}
          >
            <Text variant="body-2"> Отправитель</Text>
          </div>
          <div
            className={[
              styles.roleButton,
              role === "recipient" ? styles.roleButtonActive : undefined,
            ].join(" ")}
            onClick={() =>
              setValue("role", "recipient", { shouldValidate: true })
            }
          >
            <Text variant="body-2">Получатель</Text>
          </div>
        </div>
      </div>

      <div className={styles.section}>
        <Text variant="header-2" className={styles.sectionTitle}>
          Внешний вид посылки
        </Text>

        <div className={styles.toggles}>
          <Switch
            size="l"
            content="Доставка документов"
            checked={watch("isDocument")}
            onUpdate={(next) =>
              setValue("isDocument", next, { shouldValidate: true })
            }
          />
          <Switch
            size="l"
            content="Хрупкое"
            checked={watch("isFragile")}
            onUpdate={(next) =>
              setValue("isFragile", next, { shouldValidate: true })
            }
          />
        </div>

        <ImageUploadPreview
          preview={preview}
          onFileSelect={handleFileSelect}
          onRemove={handleRemove}
          aspectRatio="3/4"
          maxWidth={300}
          hint="Не более 10 МБ"
          hintError={formState.errors.image?.message === 'Файл не должен превышать 10 МБ'}
        />

        <div className={styles.fields}>
          <SelectField
            label="Упаковка:"
            placeholder="Выберите вариант"
            options={packagingOptions}
            controllerProps={{ control, name: "packaging" }}
            width="max"
          />

          <TextField
            label="Вес посылки:"
            placeholder="кг"
            controllerProps={{ control, name: "weight" }}
          />
          <TextField
            label="Длина:"
            placeholder="см"
            controllerProps={{ control, name: "length" }}
          />
          <TextField
            label="Ширина:"
            placeholder="см"
            controllerProps={{ control, name: "width" }}
          />
          <TextField
            label="Высота:"
            placeholder="см"
            controllerProps={{ control, name: "height" }}
          />
        </div>
      </div>

      <div className={styles.section}>
        <Text variant="header-2" className={styles.sectionTitle}>
          Вознаграждение
        </Text>

        <div className={styles.fields}>
          <TextField
            label=""
            placeholder="₽"
            controllerProps={{ control, name: "price" }}
          />
        </div>
      </div>

      <div className={styles.section}>
        <Text variant="header-2" className={styles.sectionTitle}>
          Дополнительно
        </Text>

        <TextAreaField
          placeholder="Добавьте описание задания"
          minRows={4}
          controllerProps={{ control, name: "description" }}
        />
      </div>

      <div className={styles.submitWrap}>
        <Button
          type="submit"
          view="action"
          size="xl"
          className={styles.submitButton}
          disabled={!formState.isValid || formState.isSubmitting}
          loading={formState.isSubmitting}
        >
          Продолжить
        </Button>
      </div>
    </form>
  );
};
