"use client";

import { useEffect, useRef, useState } from "react";
import { Text } from "@gravity-ui/uikit";
import Link from "next/link";

import type { TComplaint } from "@api/admin";
import { getDate } from "@utils/get-date";
import { FormattedText } from "@components/atoms/formatted-text/component";

import styles from "./complaint-card.module.css";

interface ComplaintCardProps {
  complaint: TComplaint;
}

const TYPE_LABELS: Record<string, string> = {
  AD: "Объявление",
  POST: "Пост",
  USER: "Пользователь",
};

export const ComplaintCard = ({ complaint }: ComplaintCardProps) => {
  const [expanded, setExpanded] = useState(false);
  const [overflows, setOverflows] = useState(false);
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = textRef.current;
    if (el) {
      setOverflows(el.scrollHeight > el.clientHeight);
    }
  }, [complaint.text]);

  const authorName =
    [complaint.author.firstName, complaint.author.lastName]
      .filter(Boolean)
      .join(" ") || "Неизвестный";

  const target = complaint.targetAd
    ? { label: complaint.targetAd.title, href: `/ads/${complaint.targetAd.id}` }
    : complaint.targetPost
      ? { label: complaint.targetPost.title, href: `/media/posts/${complaint.targetPost.id}` }
      : complaint.targetUser
        ? {
            label:
              [complaint.targetUser.firstName, complaint.targetUser.lastName]
                .filter(Boolean)
                .join(" ") || "Пользователь",
            href: `/profile/${complaint.targetUser.id}`,
          }
        : null;

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <span className={styles.badge}>
          {TYPE_LABELS[complaint.type] ?? complaint.type}
        </span>
        <Text variant="caption-2" color="secondary">
          {getDate(complaint.createdAt, "short")}
        </Text>
      </div>

      <div className={styles.body}>
        <div
          ref={textRef}
          className={expanded ? styles.textExpanded : styles.textCollapsed}
        >
          <FormattedText text={complaint.text} />
        </div>
        {overflows && (
          <button
            className={`${styles.expandBtn} ${expanded ? styles.expandBtnUp : ""}`}
            onClick={() => setExpanded(v => !v)}
            aria-label={expanded ? "Свернуть" : "Развернуть"}
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M2.5 5L7 9.5L11.5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        )}
      </div>

      <div className={styles.footer}>
        <Text variant="caption-2" color="secondary">
          От:{" "}
          <Link href={`/profile/${complaint.author.id}`} className={styles.link}>
            {authorName}
          </Link>
        </Text>
        {target && (
          <Text variant="caption-2" color="secondary">
            На:{" "}
            <Link href={target.href} className={styles.link}>
              {target.label}
            </Link>
          </Text>
        )}
      </div>
    </div>
  );
};
