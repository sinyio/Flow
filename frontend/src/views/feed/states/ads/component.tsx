"use client";

import { Pagination, Text } from "@gravity-ui/uikit";
import { useRouter } from "next/navigation";

import { TGetAdsParams, TGetAdsResponse } from "@api/ads";

import { buildSearchUrl } from "@utils/build-search-url";

import { AdCard } from "@entities/ad";

import styles from "./component.module.css";

export interface IAdsStateProps {
  ads?: TGetAdsResponse;
  settings?: TGetAdsParams;
}

export const AdsState = ({ ads, settings }: IAdsStateProps) => {
  const router = useRouter();

  if (!ads || !("data" in ads)) return null;

  const { data, meta } = ads;

  const handlePageChange = (page: number) => {
    router.push(buildSearchUrl({ ...settings, page, limit: 9 }), { scroll: false });
  };

  if (data.length === 0) {
    return (
      <div className={styles.empty}>
        <Text variant="display-2" color="secondary">
          Объявления не найдены
        </Text>
      </div>
    );
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.grid}>
        {data.map((ad) => (
          <AdCard key={ad.id} ad={ad} />
        ))}
      </div>

      <div className={styles.pagination}>
        <Pagination
          page={meta.page}
          pageSize={meta.limit}
          total={meta.total}
          onUpdate={handlePageChange}
          size="l"
        />
      </div>
    </div>
  );
};
