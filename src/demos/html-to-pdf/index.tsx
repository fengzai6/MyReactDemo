import { jsPDF } from "jspdf";
import { type ChangeEvent, useState } from "react";
import { usePDF } from "react-to-pdf";

export const HtmlToPdfDemo = () => {
  const { toPDF, targetRef } = usePDF({ filename: "null" });
  const [html, setHtml] = useState("");
  const [pdf, setPdf] = useState("");

  const handleHtmlChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setHtml(e.target.value);
  };

  const handleConvert = () => {
    const doc = new jsPDF();
    doc.html(html, {
      callback: (doc) => {
        setPdf(doc.output("datauristring"));
      },
    });
  };

  return (
    <div>
      <div ref={targetRef}>
        <textarea
          value={html}
          onChange={handleHtmlChange}
          placeholder="Enter html"
        ></textarea>
      </div>
      <div>
        <button onClick={handleConvert}>Convert</button>
      </div>
      <div>
        <button onClick={() => toPDF()}>Download PDF</button>
      </div>
      <div>
        <iframe src={pdf} style={{ width: "100%", height: "100vh" }} title="pdf"></iframe>
      </div>
    </div>
  );
};
