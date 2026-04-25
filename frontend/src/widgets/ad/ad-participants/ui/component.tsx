"use client";

import { ArrowRight, PersonPlus, Copy, Check } from "@gravity-ui/icons";
import { Avatar, Button, Icon, Text, User } from "@gravity-ui/uikit";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { generateRecipientInvite, TUserSnippet } from "@api/ads";
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

const UserCard = ({ user, rating }: { user: TUserSnippet; rating?: number }) => {
  const router = useRouter();

  return (
    <Card className={styles.card}>
      <User
        size="l"
        name={user.fullName}
        description={formatRating(rating) ?? undefined}
        avatar={<Avatar size="l" imgUrl={user.photo || ""} />}
        className={styles.user}
      />
      <Button
        view="action"
        size="m"
        className={styles.arrowBtn}
        onClick={() => router.push(`/profile/${user.id}`)}
      >
        <Icon data={ArrowRight} size={16} />
      </Button>
    </Card>
  );
};

export const AdParticipants = ({
  courier,
  recipient,
  adId,
  canInvite,
}: IAdParticipantsProps) => {
  const axiosInstance = useAxiosInstance();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [inviteLink, setInviteLink] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleInvite = async () => {
    setIsLoading(true);
    try {
      const { data } = await generateRecipientInvite(adId, axiosInstance);
      if ("token" in data) {
        setInviteLink(`${window.location.origin}/invitation/${data.token}`);
        setIsModalOpen(true);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(inviteLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      <div className={styles.wrapper}>
        {courier && (
          <div className={styles.section}>
            <Text variant="display-1">Исполнитель</Text>
            <UserCard user={courier} rating={courier.courierRating} />
          </div>
        )}

        <div className={styles.section}>
          <Text variant="display-1">Получатель</Text>

          {recipient ? (
            <>
              <Text variant="body-3" color="secondary">
                Получателю будет доступен QR код для получения посылки и завершения задания.
              </Text>
              <UserCard user={recipient} rating={recipient.customerRating} />
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
                  loading={isLoading}
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

      <Modal open={isModalOpen} onOpenChange={setIsModalOpen}>
        <div className={styles.modal}>
          <Text variant="header-1">Ссылка для получателя</Text>
          <Text variant="body-2" color="secondary">
            Отправьте эту ссылку получателю. Он перейдёт по ней и будет назначен получателем посылки.
          </Text>

          <div className={styles.linkRow}>
            <Text variant="body-2" className={styles.linkText} ellipsis>
              {inviteLink}
            </Text>
            <Button view="action" size="m" className={styles.copyBtn} onClick={handleCopy}>
              <Icon data={copied ? Check : Copy} size={16} />
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};
