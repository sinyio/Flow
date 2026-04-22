"use client";

import { useEffect, useState } from "react";
import { Avatar, Button, Link, Text } from "@gravity-ui/uikit";
import Image from "next/image";
import { useRouter } from "next/navigation";

import { me } from "@api/auth/me";
import { getUser } from "@api/user/get-user";
import { useApiContext } from "@contexts/api-context";
import { LiquidGlassBlock } from "@components/global/liquid-glass-block";

import styles from "./component.module.css";

export const Header = () => {
  const router = useRouter();
  const { apiClient } = useApiContext();
  const [userId, setUserId] = useState<string | null>(null);
  const [photo, setPhoto] = useState<string | null>(null);
  const [fullName, setFullName] = useState<string>("");

  useEffect(() => {
    me(apiClient)
      .then((res) => {
        const data = res.data;
        if ("userId" in data) {
          setUserId(data.userId);
          getUser(data.userId, apiClient)
            .then((res) => {
              const user = res.data;
              if ("id" in user) {
                setPhoto(user.photo ?? null);
                setFullName(`${user.firstName} ${user.lastName}`.trim());
              }
            })
            .catch(() => {});
        }
      })
      .catch(() => {});
  }, [apiClient]);

  return (
    <div className={styles.outer}>
      <LiquidGlassBlock className={styles.container}>
        <Image
          priority
          alt=""
          src="/logo.png"
          width={96}
          height={48}
          className={styles.logo}
        />

        <nav aria-label="Навигация">
          <ul className={styles.nav}>
            <li>
              <Link view="primary" className={styles.navLink} href="/">
                <Text variant="subheader-2">Лента объявлений</Text>
              </Link>
            </li>
            <li>
              <Link view="primary" className={styles.navLink} href="/media">
                <Text variant="subheader-2">Наше медиа</Text>
              </Link>
            </li>
          </ul>
        </nav>

        <div className={styles.actions}>
          <Button
            view="normal"
            size="xl"
            type="button"
            onClick={() => router.push("/ads")}
          >
            Создать объявление
          </Button>
          {userId ? (
            <div
              className={styles.avatarButton}
              onClick={() => router.push(`/profile/${userId}`)}
            >
              <Avatar
                className={styles.avatar}
                imgUrl={photo ?? undefined}
                text={fullName}
              />
            </div>
          ) : (
            <Button
              view="outlined"
              size="xl"
              type="button"
              onClick={() => router.push("/auth")}
            >
              Войти
            </Button>
          )}
        </div>
      </LiquidGlassBlock>
    </div>
  );
};
