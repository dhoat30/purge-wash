import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import BoltIcon from "@mui/icons-material/Bolt";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import VerifiedUserOutlinedIcon from "@mui/icons-material/VerifiedUserOutlined";
import Image from "next/image";
import BeforeAfter from "../../../BeforeAfterSlider/BeforeAfter";
import GetQuoteForm from "@/Components/UI/Forms/GetQuoteForm";
import Video from "@/Components/UI/Video/Video";
import GoogleReviewSnippet from "@/Components/UI/GoogleReviews/GoogleReviewCard/GoogleReviewSnippet";
import styles from "./FormSection.module.scss";

function InsuranceCoverageIcon() {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      height="42"
      viewBox="0 0 48 48"
      width="42"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M7 23C8.8 14.6 15.7 9 24 9s15.2 5.6 17 14"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2.5"
      />
      <path
        d="M7 23c3.8-3.2 7.6-3.2 11.4 0 3.7-3.2 7.5-3.2 11.2 0 3.8-3.2 7.6-3.2 11.4 0M24 9v25.5a6.5 6.5 0 0 0 13 0"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2.5"
      />
    </svg>
  );
}

function getGraphicComponent(graphic) {
  if (!graphic?.graphic_type) return null;

  if (graphic.graphic_type === "image" && graphic.image?.url) {
    const aspectRatio =
      graphic.image.width && graphic.image.height
        ? `${graphic.image.width} / ${graphic.image.height}`
        : "16 / 9";

    return (
      <div className={styles.imageWrapper} style={{ aspectRatio }}>
        <Image
          src={graphic.image.url}
          alt={graphic.image.alt || ""}
          fill
          sizes="(max-width: 1200px) 100vw, 55vw"
        />
      </div>
    );
  }

  if (
    graphic.graphic_type === "before_after" &&
    graphic.before_after_image?.before &&
    graphic.before_after_image?.after
  ) {
    return (
      <div className={styles.mediaWrapper}>
        <BeforeAfter
          data={{
            beforeImage: graphic.before_after_image.before,
            afterImage: graphic.before_after_image.after,
          }}
        />
      </div>
    );
  }

  if (graphic.graphic_type === "video" && graphic.video?.video?.url) {
    return (
      <div className={styles.mediaWrapper}>
        <Video
          videoHosted="self"
          url={graphic.video.video.url}
          placeholderImage={graphic.video.placeholder_image}
          showCompressedImage={true}
        />
      </div>
    );
  }

  if (
    graphic.graphic_type === "youtube_video" &&
    graphic.youtube_video?.youtube_id
  ) {
    return (
      <div className={styles.mediaWrapper}>
        <Video
          videoHosted="youtube"
          videoID={graphic.youtube_video.youtube_id}
          placeholderImage={graphic.youtube_video.placeholder_image}
          showCompressedImage={true}
        />
      </div>
    );
  }

  return null;
}

export default function FormSection({
  title,
  description,
  usp,
  graphic,
  reviewTitle,
  reviewerPics,
}) {
  const textUsps = Array.isArray(usp?.text_usp) ? usp.text_usp : [];
  const imageUsps = Array.isArray(usp?.image_usp) ? usp.image_usp : [];
  const graphicComponent = getGraphicComponent(graphic);

  return (
    <section className={styles.section}>
      <Container maxWidth="lg" className={styles.container}>
        <div className={styles.contentColumn}>
          <GoogleReviewSnippet
            reviewTitle={reviewTitle || "Loved by local customers"}
            reviewerPics={reviewerPics}
            leftAligned={true}
            className={styles.reviewSnippet}
          />

          <Typography
            variant="h1"
            component="h1"
            className={styles.title}
            dangerouslySetInnerHTML={{ __html: title || "" }}
          />

          {description ? (
            <Typography
              variant="h5"
              component="div"
              className={styles.description}
              dangerouslySetInnerHTML={{ __html: description }}
            />
          ) : null}

          {textUsps.length > 0 ? (
            <div className={styles.featureGrid}>
              {textUsps.map((item, index) => (
                <div
                  className={styles.featureItem}
                  key={`${item?.value}-${index}`}
                >
                  <CheckCircleIcon sx={{ fontSize: 22 }} />
                  <span>{item?.value}</span>
                </div>
              ))}
            </div>
          ) : null}

          {imageUsps.length > 0 ? (
            <div className={styles.imageUspGrid}>
              {imageUsps.map((item, index) => {
                const image = item?.image;
                if (!image?.url) return null;

                return (
                  <Image
                    key={`${image.url}-${index}`}
                    src={image.url}
                    alt={image.alt || ""}
                    width={image.width || 120}
                    height={image.height || 60}
                  />
                );
              })}
            </div>
          ) : null}

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
              <div className={styles.trustBadge}>
                <InsuranceCoverageIcon />
              </div>
              <div className={styles.trustItemText}>
                <span className={styles.trustLabel}>FULLY INSURED</span>
                <p>Up to $10 Million</p>
              </div>
            </div>

            <div className={styles.trustItem}>
              <Image
                src="/google-logo.png"
                alt="Google Rating"
                width={38}
                height={38}
              />
              <div className={styles.trustItemText}>
                <span className={styles.trustLabel}>GOOGLE RATING</span>
                <p>★★★★★ 4.9</p>
              </div>
            </div>
          </div>

          {graphicComponent}
        </div>

        <div className={styles.formColumn}>
          <div className={styles.formCard}>
            <div className={styles.formHeader}>
              <Typography
                variant="h4"
                component="h2"
                className={styles.formTitle}
              >
                Get Your Free Quote
              </Typography>
              <Typography component="p" className={styles.formSubtitle}>
                Takes 60 seconds. No obligation whatsoever.
              </Typography>
            </div>
            <div className={styles.highlightBar}>
              <BoltIcon sx={{ fontSize: 18 }} />
              <Typography variant="subtitle1" component="p" color="white">
                Efficient Stacking, Fewer Trips
              </Typography>
            </div>
            <div className={styles.formBody}>
              <GetQuoteForm hideTitle={true} />
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
