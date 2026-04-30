"use client";

import { useEffect, useRef, useState } from "react";
import { Text } from "@gravity-ui/uikit";

import { TAd } from "@api/ads";

import { getDate } from "@utils/get-date";
import { getPackageType } from "@utils/get-package-type";

import { FormattedText } from "@components/atoms/formatted-text/component";
import { Stats } from "@components/stats";

import { AdParticipants } from "@widgets/ad/ad-participants";

import styles from "./component.module.css";

export interface IAdHeaderProps {
  ad: TAd;
}

export const AdDetails = ({ ad }: IAdHeaderProps) => {
  const [expanded, setExpanded] = useState(false);
  const [overflows, setOverflows] = useState(false);
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = textRef.current;
    if (el) setOverflows(el.scrollHeight > el.clientHeight);
  }, [ad.description]);

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

  console.log(ad) // TODO: удалить

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
        {ad.description && (
          <>
            <div
              ref={textRef}
              className={expanded ? styles.descriptionExpanded : styles.descriptionCollapsed}
            >
              <FormattedText variant="body-3" text={ad.description} />
            </div>
            {overflows && (
              <button
                className={`${styles.expandBtn} ${expanded ? styles.expandBtnUp : ""}`}
                onClick={() => setExpanded((v) => !v)}
                aria-label={expanded ? "Свернуть" : "Развернуть"}
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M2.5 5L7 9.5L11.5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            )}
          </>
        )}
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
    </div>
  );
};
