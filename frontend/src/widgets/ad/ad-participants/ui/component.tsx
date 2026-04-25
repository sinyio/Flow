"use client";

import { ArrowRight } from "@gravity-ui/icons";
import { Avatar, Button, Icon, Text, User } from "@gravity-ui/uikit";
import { useRouter } from "next/navigation";
import { PersonPlus } from "@gravity-ui/icons";

import { TUserSnippet } from "@api/ads";

import { Card } from "@components/templates/card";

import styles from "./component.module.css";

interface IAdParticipantsProps {
  courier: TUserSnippet | null;
  recipient: TUserSnippet | null;
}

const formatRating = (rating?: number) => {
  if (rating === undefined || rating === null) return null;
  const stars = "★".repeat(5);
  return `${rating.toFixed(1).replace(".", ",")} ${stars}`;
};

const UserCard = ({
  user,
  rating,
}: {
  user: TUserSnippet;
  rating?: number;
}) => {
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
}: IAdParticipantsProps) => {
  return (
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
              Получателю будет доступен QR код для получения посылки и
              завершения задания.
            </Text>
            <UserCard user={recipient} rating={recipient.customerRating} />
          </>
        ) : (
          <>
            <Text variant="body-3" color="secondary">
              Пригласите получателя, чтобы он мог принять посылку без вашего
              участия.
            </Text>
            <Button size="l" className={styles.inviteBtn}>
              <div className={styles.inviteContent}>
                <Icon data={PersonPlus} size={20} />
                <Text variant="header-1">Пригласить получателя</Text>
              </div>
            </Button>
          </>
        )}
      </div>
    </div>
  );
};
