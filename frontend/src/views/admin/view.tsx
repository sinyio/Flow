"use client";

import { useEffect, useState } from "react";
import { Pagination, Text } from "@gravity-ui/uikit";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { getComplaints } from "@api/admin";
import type { TComplaint, TComplaintType } from "@api/admin";
import { useAxiosInstance } from "@api/use-axios-instance";
import { useCurrentUserStore } from "@utils/stores/current-user";

import { PackageIcon } from "@components/atoms/svgr/package-icon/icon";
import { PostsIcon } from "@components/atoms/svgr/posts-icon/icon";
import { UsersIcon } from "@components/atoms/svgr/users-icon/icon";

import { ComplaintCard } from "./complaint-card";
import styles from "./view.module.css";

const ADMIN_USER_ID = "adminuser";
const PAGE_SIZE = 20;

const NAV_ITEMS: { slug: string; type: TComplaintType; label: string; Icon: React.FC }[] = [
  { slug: "ads",   type: "AD",   label: "Объявления",   Icon: PackageIcon },
  { slug: "posts", type: "POST", label: "Посты",         Icon: PostsIcon   },
  { slug: "users", type: "USER", label: "Пользователи", Icon: UsersIcon   },
];

interface AdminViewProps {
  tab?: string;
}

export const AdminView = ({ tab = "ads" }: AdminViewProps) => {
  const router = useRouter();
  const axiosInstance = useAxiosInstance();
  const { userId, status } = useCurrentUserStore();

  const activeItem = NAV_ITEMS.find(i => i.slug === tab) ?? NAV_ITEMS[0];

  const [page, setPage] = useState(1);
  const [complaints, setComplaints] = useState<TComplaint[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (status === "loaded" && userId !== ADMIN_USER_ID) {
      router.replace("/404");
    }
  }, [userId, status, router]);

  useEffect(() => {
    setPage(1);
  }, [tab]);

  useEffect(() => {
    if (userId !== ADMIN_USER_ID) return;

    setLoading(true);
    getComplaints({ type: activeItem.type, page, limit: PAGE_SIZE }, axiosInstance)
      .then((res) => {
        setComplaints(res.data.data);
        setTotal(res.data.total);
      })
      .finally(() => setLoading(false));
  }, [activeItem.type, page, axiosInstance, userId]);

  if (status !== "loaded" || userId !== ADMIN_USER_ID) return null;

  return (
    <div className={styles.layout}>
      <aside className={styles.sidebar}>
        <Text variant="subheader-3" className={styles.sidebarTitle}>
          Админ-панель
        </Text>
        <nav className={styles.nav}>
          {NAV_ITEMS.map(({ slug, label, Icon }) => (
            <Link
              key={slug}
              href={`/admin/${slug}`}
              className={`${styles.navItem} ${tab === slug ? styles.navItemActive : ""}`}
            >
              <span className={styles.navIcon}>
                <Icon />
              </span>
              <Text variant="body-2">{label}</Text>
            </Link>
          ))}
        </nav>
      </aside>

      <main className={styles.content}>
        <Text variant="display-2" className={styles.contentTitle} as="h1">
          Последние жалобы
        </Text>

        {loading ? (
          <div className={styles.empty}>
            <Text variant="body-2" color="secondary">Загрузка...</Text>
          </div>
        ) : complaints.length === 0 ? (
          <div className={styles.empty}>
            <Text variant="body-2" color="secondary">Жалоб нет</Text>
          </div>
        ) : (
          <>
            <div className={styles.list}>
              {complaints.map((complaint) => (
                <ComplaintCard key={complaint.id} complaint={complaint} />
              ))}
            </div>
            {total > PAGE_SIZE && (
              <div className={styles.pagination}>
                <Pagination
                  page={page}
                  pageSize={PAGE_SIZE}
                  total={total}
                  onUpdate={(newPage) => setPage(newPage)}
                />
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
};
