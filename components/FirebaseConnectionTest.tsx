"use client";

import { useEffect, useState } from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { getDb } from "@/lib/firebase";
import styles from "./FirebaseConnectionTest.module.css";

type Status = "checking" | "ok" | "error";

export default function FirebaseConnectionTest() {
  const [status, setStatus] = useState<Status>("checking");
  const [detail, setDetail] = useState("Firestore に接続しています...");

  useEffect(() => {
    async function checkConnection() {
      try {
        const db = getDb();
        const testRef = doc(db, "connectionTests", "hello");

        await setDoc(testRef, {
          message: "ok",
          checkedAt: new Date().toISOString(),
        });

        const snapshot = await getDoc(testRef);

        if (!snapshot.exists()) {
          throw new Error("書き込み後にデータを読めませんでした");
        }

        setStatus("ok");
        setDetail("書き込みと読み取りに成功しました。");
      } catch (error) {
        setStatus("error");
        setDetail(
          error instanceof Error
            ? error.message
            : "接続確認中にエラーが発生しました",
        );
      }
    }

    void checkConnection();
  }, []);

  return (
    <section className={styles.card}>
      <p className={styles.label}>Firebase 接続確認</p>
      <p className={styles.status} data-status={status}>
        {status === "checking" && "確認中"}
        {status === "ok" && "成功"}
        {status === "error" && "失敗"}
      </p>
      <p className={styles.detail}>{detail}</p>
    </section>
  );
}
