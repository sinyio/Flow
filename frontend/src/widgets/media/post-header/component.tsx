import Image from "next/image";

import styles from "./component.module.css";
import { Header } from "./header";

interface ProfileHeaderProps {
  canEdit?: boolean;
  photoUrl: string;
  postId: string;
  onDeletePost?: () => void;
}

export const PostHeader = ({ canEdit, photoUrl, postId, onDeletePost }: ProfileHeaderProps) => {
  return (
    <div className={styles.imageWrapper}>
      <Image fill priority alt="" src={photoUrl} className={styles.image} />
      <Header postId={postId} canEdit={canEdit} onDeletePost={onDeletePost} />
    </div>
  );
};
