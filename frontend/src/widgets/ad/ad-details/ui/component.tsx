"use client";

import { useState } from "react";
import { Button, Icon, Text } from "@gravity-ui/uikit";
import { useRouter } from "next/navigation";

import { TAd } from "@api/ads";
import { respondToAd } from "@api/ads";

import { getDate } from "@utils/get-date";
import { getPackageType } from "@utils/get-package-type";

import { Stats } from "@components/stats";
import { PenIcon } from "@components/svgr/pen-icon/icon";

import { AdParticipants } from "@widgets/ad/ad-participants";
import { useAxiosInstance } from '@api/use-axios-instance'

import styles from "./component.module.css";

export interface IAdHeaderProps {
  ad: TAd;
}

export const AdDetails = ({ ad }: IAdHeaderProps) => {
  const router = useRouter();
  const axiosInstance = useAxiosInstance();
  const [responding, setResponding] = useState(false);

  const handleRespond = async () => {
    setResponding(true);
    try {
      await respondToAd(ad.id, axiosInstance);
      router.push("/chats");
    } finally {
      setResponding(false);
    }
  };

  const list = [
    { label: "Вес", value: ad.weight },
    { label: "Габариты", value: `${ad.height}x${ad.width}x${ad.length} см` },
    { label: "Упаковка", value: getPackageType(ad.packaging) },
    { label: "Хрупкое", value: ad.isFragile ? "Да" : "Нет" },
    { label: "Документы", value: ad.isDocument ? "Да" : "Нет" },
  ];

  const stats = [
    `${ad.fromCity} - ${ad.toCity}`,
    `${getDate(ad.endDate, "before")}`,
  ];

  return (
    <div className={styles.adDetails}>
      {(ad.userState.canEdit ||
        ad.userState.role === 'courier' ||
        ad.userState.role === 'recipient') && (
        <AdParticipants
          courier={ad.courier}
          recipient={ad.recipient}
          adId={ad.id}
          canInvite={ad.userState.canEdit}
        />
      )}

      <div className={styles.adDescriptionBlock}>
        <Text variant="display-1">Описание</Text>
        <Text
          variant="body-3"
          color="secondary"
          className={styles.adDescriptionText}
        >
          {ad.description}
        </Text>
      </div>

      <Stats
        stats={stats}
        labelProps={{
          size: "m",
          theme: "normal",
          className: styles.statsContainer,
        }}
        textProps={{ className: styles.statsChip }}
      />

      <div className={styles.adMetaGrid}>
        {list.map((item) => (
          <div key={item.label} className={styles.adMetaRow}>
            <Text
              variant="body-2"
              color="secondary"
              className={styles.adMetaLabel}
            >
              {item.label}
            </Text>
            <div className={styles.dashedLine} />
            <Text variant="body-2" className={styles.adMetaValue}>
              {item.value}
            </Text>
          </div>
        ))}
      </div>
      {ad.userState.canEdit && (
        <Button
          view="normal"
          size="l"
          className={styles.editButton}
          onClick={() => router.push(`/ads/${ad.id}/edit`)}
        >
          <Icon data={PenIcon} size={20} />
          <Text variant="header-1">Редактировать</Text>
        </Button>
      )}
      {!ad.userState.canEdit &&
        ad.userState.role === "viewer" &&
        !ad.userState.hasResponded && (
          <Button
            view="action"
            size="l"
            className={styles.editButton}
            onClick={handleRespond}
            loading={responding}
          >
            <Text variant="header-1">Откликнуться</Text>
          </Button>
        )}
    </div>
  );
};
