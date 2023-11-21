import Part from "./Part";
import { CoursePart } from "../types";

interface ContentProps {
  courseParts: Array<CoursePart>;
}

const Content = (props: ContentProps) => {
  return (
    <>
      {props.courseParts.map((coursePart) => (
        <Part key={coursePart.name} coursePart={coursePart}/>
      ))}
    </>
  );
};

export default Content;
