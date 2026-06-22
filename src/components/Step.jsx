function Step({ number, title, text }) {
  return (
    <article className="step">
      <span>{number}</span>
      <div>
        <h3>{title}</h3>
        <p>{text}</p>
      </div>
    </article>
  );
}

export default Step;
