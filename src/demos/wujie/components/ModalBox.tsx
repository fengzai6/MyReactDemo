import { Button, Modal } from "antd";
import { useState } from "react";
import { ProgressLink } from "./ProgressLink";
import { ProgressNum } from "./ProgressNum";
import type { IWuJieLink } from "../types";

interface IModalBoxProps {
  data: IWuJieLink;
}

export const ModalBox = ({ data }: IModalBoxProps) => {
  const [visible, setVisible] = useState(false);

  return (
    <div>
      <Button onClick={() => setVisible(true)} className="my-8">
        show modal
      </Button>
      <Modal
        open={visible}
        onCancel={() => {
          console.log("close");
          setVisible(false);
        }}
      >
        <div>modal内显示子应用组件</div>
        <ProgressLink data={data} />
        <ProgressNum />
      </Modal>
    </div>
  );
};
