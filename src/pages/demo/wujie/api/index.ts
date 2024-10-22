import WujieReact from "wujie-react";

const { bus } = WujieReact;

bus.$on("getMsg", async () => {
  const msg = await new Promise((resolve) => {
    setTimeout(() => {
      resolve("hello wujie");
    }, 1000);
  });

  bus.$emit("showMsg", msg);
});
