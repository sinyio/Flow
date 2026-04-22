"use client";

import { useEffect, useRef, useState } from "react";
import { Avatar, Button, Text } from "@gravity-ui/uikit";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

import { getUser } from "@api/user/get-user";
import { useApiContext } from "@contexts/api-context";
import { subscribeAuthChange } from "@utils/auth-events";
import { useCurrentUserStore } from "@utils/stores/current-user";
import { LiquidGlassBlock } from "@components/global/liquid-glass-block";
import { Skeleton } from "src/ui-kit";

import styles from "./component.module.css";

export const Header = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { apiClient } = useApiContext();
  const { fetch: fetchCurrentUser, invalidate, clear } = useCurrentUserStore();
  const [userId, setUserId] = useState<string | null>(null);
  const [photo, setPhoto] = useState<string | null>(null);
  const [fullName, setFullName] = useState("");
  const [loaded, setLoaded] = useState(false);
  const prevPathname = useRef(pathname);

  const fetchUser = () => {
    setLoaded(false);
    fetchCurrentUser(apiClient)
      .then((id) => {
        if (id) {
          setUserId(id);
          getUser(id, apiClient)
            .then((res) => {
              const user = res.data;
              if ("id" in user) {
                setPhoto(user.photo ?? null);
                setFullName(`${user.firstName} ${user.lastName}`.trim());
              }
            })
            .catch(() => {})
            .finally(() => setLoaded(true));
        } else {
          setUserId(null);
          setLoaded(true);
        }
      })
      .catch(() => setLoaded(true));
  };

  useEffect(() => {
    fetchUser();
  }, []);

  useEffect(() => {
    const wasOnAuth = prevPathname.current.startsWith("/auth");
    prevPathname.current = pathname;
    if (wasOnAuth && !pathname.startsWith("/auth")) {
      invalidate();
      fetchUser();
    }
  }, [pathname]);

  useEffect(() => {
    const unsubscribe = subscribeAuthChange(() => {
      clear();
      setUserId(null);
      setPhoto(null);
      setFullName("");
      setLoaded(true);
    });
    return () => { unsubscribe(); };
  }, []);

  return (
    <div className={styles.outer}>
      <LiquidGlassBlock className={styles.container}>
        <Link href="/" className={styles.logoLink}>
          <Image
            priority
            alt="Флоу"
            src="/logo.png"
            width={96}
            height={48}
            className={styles.logo}
          />
        </Link>

        <nav aria-label="Навигация">
          <ul className={styles.nav}>
            <li>
              <Link className={styles.navLink} href="/feed">
                <Text variant="subheader-2">Лента объявлений</Text>
              </Link>
            </li>
            <li>
              <Link className={styles.navLink} href="/media">
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
            className={styles.actionButton}
          >
            Создать объявление
          </Button>
          {!loaded ? (
            <Skeleton variant="circle" width={40} height={40} />
          ) : userId ? (
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
              className={styles.actionButton}
            >
              Войти
            </Button>
          )}
        </div>
      </LiquidGlassBlock>
    </div>
  );
};
