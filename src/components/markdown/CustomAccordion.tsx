import Image from "next/image";
import { Accordion } from "react-bootstrap";

const CustomAccordion: React.FC<{
  question: string | React.ReactNode;
  children: React.ReactNode;
  index: number;
}> = ({ question, children, index }) => {
  return (
    <div className="faq_accordions">
      <Accordion defaultActiveKey="0">
        <Accordion.Item key={index} eventKey={String(index)}>
          <Accordion.Header>
            <p>{question}</p>
            <div className="accordion_arrow_icon_container">
              <Image
                src="/assets/images/gray-down-arrow.svg"
                height={25}
                width={25}
                alt="down-arrow"
              />
              <Image
                src="/assets/images/gray-down-arrow.svg"
                height={25}
                width={25}
                alt="up-arrow"
              />
            </div>
          </Accordion.Header>
          <Accordion.Body>{children}</Accordion.Body>
        </Accordion.Item>
      </Accordion>
    </div>
  );
};

export default CustomAccordion;
