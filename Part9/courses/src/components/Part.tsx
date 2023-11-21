import { CoursePart } from "../types";

interface PartProps {
  coursePart: CoursePart;
}

const Part = (props: PartProps) => {
  const lessMargin = {
    marginTop: '1px',
    marginBottom: '1px',
  }
  return (
    <div style={{marginBottom: '1.5rem'}}>
      <p style={lessMargin}>
        <strong>
        {props.coursePart.name} {props.coursePart.exerciseCount}
        </strong>
      </p>
      {(() => {
        switch (props.coursePart.kind) {
          case "basic":
            return <em style={lessMargin}>{props.coursePart.description}</em>;
          case "group":
            return <p style={lessMargin}>group projects {props.coursePart.groupProjectCount}</p>;
          case "background":
            return (
              <>
                <em style={lessMargin}>{props.coursePart.description}</em>
                <p style={lessMargin}>refer to {props.coursePart.backgroundMaterial}</p>
              </>
            );
          case "special":
            return (
              <>
                <em style={lessMargin}>{props.coursePart.description}</em>
                <p style={lessMargin}>required skills: {props.coursePart.requirements.join(", ")}</p>
              </>
            )
          default:{
            const _exhaustiveCheck: never = props.coursePart;
            return _exhaustiveCheck;
          }
        }
      })()}
    </div>
  );
};

export default Part;
