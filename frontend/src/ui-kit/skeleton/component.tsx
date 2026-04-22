import styles from "./component.module.css";

interface SkeletonProps {
  width?: number | string;
  height?: number | string;
  variant?: "rounded" | "circle" | "none";
  className?: string;
}

export const Skeleton = ({
  width,
  height,
  variant = "rounded",
  className,
}: SkeletonProps) => (
  <div
    className={[
      styles.skeleton,
      variant === "circle" ? styles.circle : variant === "rounded" ? styles.rounded : "",
      className,
    ]
      .filter(Boolean)
      .join(" ")}
    style={{ width, height }}
  />
);
