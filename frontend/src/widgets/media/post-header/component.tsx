import Image from "next/image";

import styles from "./component.module.css";
import { Header } from "./header";
import { useResponsive } from "@utils/hooks/use-responsive";

interface ProfileHeaderProps {
  canEdit?: boolean;
  photoUrl: string;
  postId: string;
  onDeletePost?: () => void;
}

export const PostHeader = ({ canEdit, photoUrl, postId, onDeletePost }: ProfileHeaderProps) => {
  const { device } = useResponsive();
  return (
    <div className={styles.imageWrapper}>
      <Image fill priority alt="" src={photoUrl} className={styles.image} />
      {device === "mobile" && (
        <Header postId={postId} canEdit={canEdit} onDeletePost={onDeletePost} />
      )}
    </div>
  );
};
