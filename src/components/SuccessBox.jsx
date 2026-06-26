export default function SuccessBox({ message }) {
  if (!message) return null;
  return <div className="auth-success">{message}</div>;
}