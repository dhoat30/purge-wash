import Image from "next/image";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import VerifiedUserOutlinedIcon from "@mui/icons-material/VerifiedUserOutlined";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import MovingQuoteLeadForm from "@/Components/UI/Forms/MovingQuoteLeadForm";
import styles from "./GetFreeMovingQuotePage.module.scss";

const featureItems = [
  "2 Men + Truck | $65/hr",
  "No depot fee, pay on arrival",
  "Packing & unpacking available",
  "We can beat any quote by 10%",
  "WINZ Quotes",
  "Full transit insurance",
];

export default function GetFreeMovingQuotePage() {
  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <Container maxWidth="lg" className={styles.heroInner}>
          <div className={styles.contentColumn}>
            <div className={styles.promoPill}>
              <span className={styles.promoDot} />
              Price Beat Guarantee — We&apos;ll Beat Any Quote by 10%
            </div>

            <Typography variant="h1" component="h1" className={styles.title}>
              Stress-Free House
              <br />
              Moves — Quote in <span>15 Minutes</span>
            </Typography>

            <Typography variant="h5" component="p" className={styles.description}>
              <strong>Hamilton&apos;s trusted removalists.</strong> Professional team,
              transparent pricing, and no hidden costs. Get a response within 15 minutes.
            </Typography>

            <div className={styles.featureGrid}>
              {featureItems.map((item) => (
                <div key={item} className={styles.featureItem}>
                  <CheckCircleIcon sx={{ fontSize: 22 }} />
                  <span>{item}</span>
                </div>
              ))}
            </div>

            <div className={styles.trustPanel}>
              <div className={styles.trustItem}>
                <div className={styles.trustBadge}>
                  <VerifiedUserOutlinedIcon sx={{ fontSize: 32 }} />
                </div>
                <div className={styles.trustItemText}>
                  <span className={styles.trustLabel}>NZ OWNED</span>
                  <p>Professional Team</p>
                </div>
              </div>

              <div className={styles.trustItem}>
                <Image src="/winz-logo.png" alt="WINZ Approved" width={42} height={42} />
                <div className={styles.trustItemText}>
                  <span className={styles.trustLabel}>WINZ</span>
                  <p>Approved</p>
                </div>
              </div>

              <div className={styles.trustItem}>
                <Image src="/google-logo.png" alt="Google Rating" width={38} height={38} />
                <div className={styles.trustItemText}>
                  <span className={styles.trustLabel}>GOOGLE RATING</span>
                  <p>★★★★★ 4.9</p>
                </div>
              </div>
            </div>
          </div>

          <div className={styles.formColumn}>
            <MovingQuoteLeadForm />
          </div>
        </Container>
      </section>
    </div>
  );
}
