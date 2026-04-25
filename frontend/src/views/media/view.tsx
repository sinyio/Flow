"use client";

import Image from "next/image";
import { useMemo } from "react";
import { ArrowIcon } from '@components/svgr/arrow-icon/icon'

import { Button, Icon, Text, TextProps } from "@gravity-ui/uikit";

import { TPost, TGetPostsParams, TPaginationMeta } from "@api/media";

import { PageContainer } from "@components/global/page-container";
import { LiquidGlassBlock } from "@components/global/liquid-glass-block";
import { useResponsive } from "@utils/hooks/use-responsive";

import { MediaSearch } from "@widgets/media";

import { PostsState } from "./states/posts/component";
import { MainState } from "./states/main/component";
import styles from "./view.module.css";
import { useRouter } from "next/navigation";

export interface IMediaViewProps {
  flowPosts?: TPost[];
  userPosts?: TPost[];
  searchPosts?: TPost[];
  searchMeta?: TPaginationMeta;
  settings?: TGetPostsParams;
}

export const MediaView = ({
  flowPosts,
  userPosts,
  searchPosts,
  searchMeta,
  settings,
}: IMediaViewProps) => {
  const { device } = useResponsive();
  const headerText = useMemo(
    () =>
      ({ mobile: "display-1", tablet: "display-2", desktop: "display-3" })[
        device
      ],
    [device],
  ) as TextProps["variant"];

  const router = useRouter()

  return (
    <>
      <div className={styles.hero}>
        <div className={styles.heroInner}>
          <Image
            fill
            preload={true}
            src="/media-hero.webp"
            alt=""
            className={styles.heroImage}
            aria-hidden="true"
          />
          <LiquidGlassBlock className={styles.heroCard}>
            {/* {device === "mobile" && (
              <Button
                view="normal"
                size="l"
                onClick={() => router.push('/')}
                className={styles.backButton}
              >
                <Icon data={ArrowIcon} size={20} />
              </Button>
            )} */}
            <Text variant={headerText} className={styles.heroTitle} as="h1">
              Медиа флоу
            </Text>
          </LiquidGlassBlock>
        </div>
      </div>

      <MediaSearch />

      <PageContainer inner={{ className: styles.pageInner }}>
        {settings ? (
          <PostsState posts={searchPosts} meta={searchMeta} filter={settings.filter} sort={settings.sort} search={settings.search} />
        ) : (
          <MainState flowPosts={flowPosts} userPosts={userPosts} />
        )}
      </PageContainer>
    </>
  );
};

export default MediaView;
