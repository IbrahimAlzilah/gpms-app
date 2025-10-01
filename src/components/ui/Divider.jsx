import { useContext } from "react";

function Divider({ title, color }) {
  const styles = {
    background: "#1e1e1e",
    color: "yellow",
  };

  return (
    <div className={`divider-root relative ${title ? "my-6" : "my-4"}`}>
      {title && (
        <h3
          className="truncated-text text-lg font-semibold absolute -top-4 left-1/2 -translate-x-1/2 px-3"
          style={styles}
        >
          {title}
        </h3>
      )}
    </div>
  );
}

export default Divider;
