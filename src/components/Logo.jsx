import logoImage from "../images/Al-Sham Private University.png";

export default function Logo({ size = 38, alt = "ASPU Insight" }) {
  return (
    <img
      src={logoImage}
      alt={alt}
      style={{
        width: size,
        height: size,
        flexShrink: 0,
        display: "block",
        objectFit: "contain",
      }}
    />
  );
}
