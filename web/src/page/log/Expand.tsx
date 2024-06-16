interface TypeLogExpandProps {
  children: string;
}

/**
 * @name Expand 扩展信息
 */
const Expand: React.FC<TypeLogExpandProps> = ({ children }) => {
  try {
    const data = JSON.parse(children);
    return (
      <pre>
        {JSON.stringify(
          typeof data === "string" ? JSON.parse(data) : data,
          null,
          2,
        )}
      </pre>
    );
  } catch (error) {
    return children;
  }
};

export default Expand;
