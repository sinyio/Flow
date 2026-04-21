import Image from "next/image";

import styles from "./component.module.css";
import { Header } from "./header";
import { useResponsive } from "@utils/hooks/use-responsive";

interface ProfileHeaderProps {
  canEdit?: boolean;
  photoUrl: string;
  postId: string;
}

export const PostHeader = ({ canEdit, photoUrl, postId }: ProfileHeaderProps) => {
  const { device } = useResponsive();
  return (
    <div className={styles.imageWrapper}>
      <Image fill priority alt="" src={photoUrl} className={styles.image} />
      {device === "mobile" && <Header postId={postId} />}
    </div>
  );
};
