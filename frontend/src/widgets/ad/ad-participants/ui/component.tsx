"use client";

import { Check, Copy, PersonPlus, Xmark } from "@gravity-ui/icons";
import { Avatar, Button, Icon, Text, User } from "@gravity-ui/uikit";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { generateRecipientInvite, removeCourier, removeRecipient, TUserSnippet } from "@api/ads";
import { useAxiosInstance } from "@api/use-axios-instance";

import { Card } from "@components/templates/card";
import { Modal } from "src/ui-kit";

import styles from "./component.module.css";

interface IAdParticipantsProps {
  courier: TUserSnippet | null;
  recipient: TUserSnippet | null;
  adId: string;
  canInvite: boolean;
}

const formatRating = (rating?: number) => {
  if (rating === undefined || rating === null) return null;
  const stars = "★".repeat(5);
  return `${rating.toFixed(1).replace(".", ",")} ${stars}`;
};

const UserCard = ({
  user,
  rating,
  onDelete,
}: {
  user: TUserSnippet;
  rating?: number;
  onDelete?: () => void;
}) => {
  const router = useRouter();

  return (
    <Card className={styles.card} onClick={() => router.push(`/profile/${user.id}`)}>
      <User
        size="l"
        name={user.fullName}
        description={formatRating(rating) ?? undefined}
        avatar={<Avatar size="l" imgUrl={user.photo || ""} />}
        className={styles.user}
      />
      {onDelete && (
        <Button
          view="flat-danger"
          size="m"
          className={styles.deleteBtn}
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
        >
          <Icon data={Xmark} size={20} />
        </Button>
      )}
    </Card>
  );
};

export const AdParticipants = ({
  courier,
  recipient,
  adId,
  canInvite,
}: IAdParticipantsProps) => {
  const router = useRouter();
  const axiosInstance = useAxiosInstance();

  const [inviteModalOpen, setInviteModalOpen] = useState(false);
  const [inviteLink, setInviteLink] = useState("");
  const [inviteLoading, setInviteLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const [confirmTarget, setConfirmTarget] = useState<"courier" | "recipient" | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const handleInvite = async () => {
    setInviteLoading(true);
    try {
      const { data } = await generateRecipientInvite(adId, axiosInstance);
      if ("token" in data) {
        setInviteLink(`${window.location.origin}/invitation/${data.token}`);
        setInviteModalOpen(true);
      }
    } finally {
      setInviteLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(inviteLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleConfirmDelete = async () => {
    if (!confirmTarget) return;
    setDeleteLoading(true);
    try {
      if (confirmTarget === "courier") {
        await removeCourier(adId, axiosInstance);
      } else {
        await removeRecipient(adId, axiosInstance);
      }
      setConfirmTarget(null);
      router.refresh();
    } finally {
      setDeleteLoading(false);
    }
  };

  const confirmLabel =
    confirmTarget === "courier" ? "исполнителя" : "получателя";

  return (
    <>
      <div className={styles.wrapper}>
        {courier && (
          <div className={styles.section}>
            <Text variant="display-1">Исполнитель</Text>
            <UserCard
              user={courier}
              rating={courier.courierRating}
              onDelete={canInvite ? () => setConfirmTarget("courier") : undefined}
            />
          </div>
        )}

        <div className={styles.section}>
          <Text variant="display-1">Получатель</Text>

          {recipient ? (
            <>
              <Text variant="body-3" color="secondary">
                Получателю будет доступен QR код для получения посылки и завершения задания.
              </Text>
              <UserCard
                user={recipient}
                rating={recipient.customerRating}
                onDelete={canInvite ? () => setConfirmTarget("recipient") : undefined}
              />
            </>
          ) : (
            <>
              <Text variant="body-3" color="secondary">
                Пригласите получателя, чтобы он мог принять посылку без вашего участия.
              </Text>
              {canInvite && (
                <Button
                  size="l"
                  className={styles.inviteBtn}
                  loading={inviteLoading}
                  onClick={handleInvite}
                >
                  <div className={styles.inviteContent}>
                    <Icon data={PersonPlus} size={20} />
                    <Text variant="header-1">Пригласить получателя</Text>
                  </div>
                </Button>
              )}
            </>
          )}
        </div>
      </div>

      {/* Модалка с ссылкой приглашения */}
      <Modal open={inviteModalOpen} onOpenChange={setInviteModalOpen}>
        <div className={styles.modal}>
          <Text variant="header-1">Ссылка для получателя</Text>
          <Text variant="body-2" color="secondary">
            Отправьте эту ссылку получателю. Он перейдёт по ней и будет назначен получателем посылки.
          </Text>
          <div className={styles.linkRow}>
            <Text variant="body-2" className={styles.linkText}>
              {inviteLink}
            </Text>
            <Button view="action" size="m" className={styles.copyBtn} onClick={handleCopy}>
              <Icon data={copied ? Check : Copy} size={16} />
            </Button>
          </div>
        </div>
      </Modal>

      {/* Модалка подтверждения удаления */}
      <Modal open={!!confirmTarget} onOpenChange={(open) => !open && setConfirmTarget(null)}>
        <div className={styles.confirmModal}>
          <Text variant="header-2">Снять {confirmLabel}?</Text>
          <Text variant="body-2" color="secondary">
            Вы уверены, что хотите снять {confirmLabel}? Это действие нельзя отменить.
          </Text>
          <div className={styles.confirmActions}>
            <Button onClick={() => setConfirmTarget(null)}>Отмена</Button>
            <Button view="outlined-danger" loading={deleteLoading} onClick={handleConfirmDelete}>
              Снять
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};
