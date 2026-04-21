"use client";

import { Button, DropdownMenu, Icon, useToaster } from "@gravity-ui/uikit";
import { useRouter } from "next/navigation";
import { Pencil } from "@gravity-ui/icons";

import { ArrowIcon } from "@components/svgr/arrow-icon/icon";
import { DotsIcon } from "@components/svgr/dots-icon/icon";
import { FlagIcon } from "@components/svgr/flag-icon/icon";
import { ShareIcon } from "@components/svgr/share-icon/icon";

import styles from "./header.module.css";

export const Header = ({ postId }: { postId: string }) => {
  const router = useRouter();
  const { add } = useToaster();

  const notifySoon = () => {
    add({
      isClosable: true,
      theme: "warning",
      name: "feature_soon",
      title: "Скоро",
      content: "Эта функция пока недоступна.",
    });
  };

  return (
    <div className={styles.header}>
      <Button
        view="normal"
        size="l"
        type="button"
        onClick={() => router.push("/media")}
      >
        <Icon data={ArrowIcon} />
      </Button>
      <DropdownMenu
        size="l"
        popupProps={{
          placement: "bottom-end",
          offset: 8,
          style: { width: "200px" },
        }}
        renderSwitcher={(props) => (
          <Button {...props} view="normal" size="l">
            <Icon data={DotsIcon} />
          </Button>
        )}
        items={[
          {
            iconStart: <Pencil />,
            text: "Редактировать",
            action: () => router.push(`/media/posts/${postId}/edit`),
          },
          {
            iconStart: <FlagIcon />,
            text: "Пожаловаться",
            action: () => notifySoon(),
          },
          {
            iconStart: <ShareIcon />,
            text: "Поделиться",
            action: () => notifySoon(),
          },
        ]}
      />
    </div>
  );
};
