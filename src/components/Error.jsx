import styles from "./Error.module.css";

function Error({ error }) {
  return (
    <div className={styles.errorWrapper}>
      <p className={styles.errorMes}>{error}!</p>
    </div>
  );
}

export default Error;
