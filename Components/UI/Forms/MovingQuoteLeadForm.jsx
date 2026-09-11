"use client";

import React, { useMemo, useState } from "react";
import axios from "axios";
import dayjs from "dayjs";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";
import BoltIcon from "@mui/icons-material/Bolt";
import LocalPhoneIcon from "@mui/icons-material/LocalPhone";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Input from "./InputFields/Input";
import GoogleAutocomplete from "@/Components/GoogleMaps/GoogleAutoComplete";
import { useRouter } from "next/navigation";
import { useClickIds } from "@/hooks/useClickIds";
import { sendFormSubmissionToGoogleTagManager } from "@/utils/googleTagManager";
import styles from "./MovingQuoteLeadForm.module.scss";

const FORM_FIELDS = [
  {
    id: "pickUpAddress",
    label: "Moving from",
    required: true,
    errorMessage: "Please enter a valid pickup address",
    validation: (value) => typeof value === "string" && value.trim().length > 5,
  },
  {
    id: "dropOffAddress",
    label: "Moving to",
    required: true,
    errorMessage: "Please enter a valid drop-off address",
    validation: (value) => typeof value === "string" && value.trim().length > 5,
  },
  {
    id: "firstname",
    label: "First name",
    type: "text",
    required: true,
    autoComplete: "given-name",
    errorMessage: "First name should be at least 3 characters long",
    validation: (value) => typeof value === "string" && value.trim().length > 2,
  },
  {
    id: "email",
    label: "Email address",
    type: "email",
    required: true,
    autoComplete: "email",
    errorMessage: "Enter a valid email address",
    validation: (value) => /\S+@\S+\.\S+/.test(value || ""),
  },
  {
    id: "phone",
    label: "Phone number",
    type: "tel",
    required: false,
    autoComplete: "tel",
    errorMessage: "Please enter a valid New Zealand phone number",
    validation: (value) => {
      const cleanPhone = (value || "").replace(/[^0-9]/g, "");
      return cleanPhone.length > 6;
    },
  },
];

const INITIAL_FORM_DATA = {
  firstname: "",
  email: "",
  phone: "",
  pickUpAddress: "",
  dropOffAddress: "",
};

const INITIAL_GOOGLE_ADDRESS = {
  pickUpAddress: {},
  dropOffAddress: {},
};

function isFieldValid(field, value) {
  if (!field.required && !value) {
    return true;
  }

  return field.validation(value);
}

export default function MovingQuoteLeadForm({
  formName = "Get a Free Moving Quote",
  title = "Get Your Free Quote",
  subtitle = "Takes 60 seconds. No obligation whatsoever.",
  highlightText = "Efficient Stacking, Fewer Trips",
  submitButtonText = "GET FREE QUOTE",
  showPhoneCta = true,
  footerNote = "Honest advice • Free Quote • No obligation",
  className = "",
}) {
  const router = useRouter();
  const phoneNumber = process.env.NEXT_PUBLIC_PHONE_NUMBER;
  const { clickIds } = useClickIds();
  const [formData, setFormData] = useState(INITIAL_FORM_DATA);
  const [errors, setErrors] = useState({});
  const [error, setError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [googleAdsAddress, setGoogleAdsAddress] = useState(INITIAL_GOOGLE_ADDRESS);

  const fieldsById = useMemo(
    () => Object.fromEntries(FORM_FIELDS.map((field) => [field.id, field])),
    []
  );

  const handleChange = (id, value) => {
    const nextValue = value?.target ? value.target.value : value;

    setFormData((prevFormData) => ({
      ...prevFormData,
      [id]: nextValue,
    }));

    if (errors[id]) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [id]: false,
      }));
    }
  };

  const handleBlur = (id) => {
    const field = fieldsById[id];
    if (!field) return;

    if (!isFieldValid(field, formData[id])) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [id]: true,
      }));
    }
  };

  const validateForm = () => {
    const nextErrors = {};

    FORM_FIELDS.forEach((field) => {
      if (!isFieldValid(field, formData[field.id])) {
        nextErrors[field.id] = true;
      }
    });

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const submitHandler = async (event) => {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    const parts = formData.firstname.trim().split(/\s+/);
    const firstName = parts[0] || "";
    const formattedDate = dayjs().valueOf();
    const transactionId =
      typeof crypto !== "undefined" && crypto.randomUUID
        ? crypto.randomUUID()
        : `lead-${Date.now()}-${Math.random().toString(36).slice(2)}`;

    const dataPayload = {
      email: formData.email,
      formName,
      message: `First Name: ${formData.firstname}
Email: ${formData.email}
Phone Number: ${formData.phone}
Pick Up Address: ${formData.pickUpAddress}
Drop Off Address: ${formData.dropOffAddress}
Move Date: ${formattedDate}`,
      portalID: process.env.NEXT_PUBLIC_HUBSPOT_PORTAL_ID,
      hubspotFormID: process.env.NEXT_PUBLIC_HUBSPOT_SIMPLE_FORM_ID,
      hubspotFormObject: [
        { name: "hs_google_click_id", value: clickIds.gclid || "" },
        { name: "gbraid", value: clickIds.gbraid || "" },
        { name: "wbraid", value: clickIds.wbraid || "" },
        { name: "gads_campaign_id", value: clickIds.gads_campaign_id || "" },
        { name: "gads_adgroup_id", value: clickIds.gads_adgroup_id || "" },
        { name: "gads_ad_id", value: clickIds.gads_ad_id || "" },
        { name: "campaign_name", value: clickIds.campaign_name || "" },
        { name: "adgroup_name", value: clickIds.adgroup_name || "" },
        { name: "ad_name", value: clickIds.ad_name || "" },
        { name: "utm_term", value: clickIds.utm_term || "" },
        { name: "utm_matchtype", value: clickIds.utm_matchtype || "" },
        { name: "utm_network", value: clickIds.utm_network || "" },
        { name: "utm_device", value: clickIds.utm_device || "" },
        { name: "utm_content", value: clickIds.utm_content || "" },
        { name: "utm_source", value: clickIds.utm_source || "" },
        { name: "hs_facebook_click_id", value: clickIds.fbclid || "" },
        { name: "fbp", value: clickIds.fbp || "" },
        { name: "fbc", value: clickIds.fbc || "" },
        { name: "fb_campaign_id", value: clickIds.fb_campaign_id || "" },
        { name: "fb_platform", value: clickIds.fb_platform || "" },
        { name: "fb_ad_id", value: clickIds.fb_ad_id || "" },
        { name: "fb_adset_id", value: clickIds.fb_adset_id || "" },
        { name: "fb_site_source", value: clickIds.fb_site_source || "" },
        { name: "firstname", value: formData.firstname },
        { name: "email", value: formData.email },
        { name: "phone", value: formData.phone },
        { name: "pick_up_address", value: formData.pickUpAddress },
        { name: "drop_off_address", value: formData.dropOffAddress },
        { name: "move_date", value: "" },
        { name: "message", value: "" },
      ],
    };

    const configHubspot = {
      method: "post",
      url: "/api/submit-hubspot-form",
      headers: { "Content-Type": "application/json" },
      data: dataPayload,
    };

    const configSendMail = {
      method: "post",
      url: "/api/sendmail",
      headers: { "Content-Type": "application/json" },
      data: dataPayload,
    };

    const configGoogleAdsConversion = {
      method: "post",
      url: "/api/google-ads-conversion",
      headers: { "Content-Type": "application/json" },
      data: {
        clickIds,
        email: formData.email,
        phone: formData.phone,
        transactionId,
        conversionValue: 0,
        currencyCode: "NZD",
      },
    };

    setIsLoading(true);
    setError(false);

    try {
      const response = await Promise.all([
        axios(configHubspot),
        axios(configSendMail),
      ]);

      if (response[0].status === 200) {
        axios(configGoogleAdsConversion).catch((conversionError) => {
          console.warn("Google Ads conversion upload skipped/failed", conversionError);
        });

        sendFormSubmissionToGoogleTagManager({
          eventName: "quote_form_submission",
          formName: "Moving Quote",
          transactionId,
          conversionValue: 0,
          currency: "NZD",
          clickIds,
          formData: {
            firstName,
            email: formData.email,
            phone: formData.phone,
            street: `${googleAdsAddress.pickUpAddress.streetNumber || ""} ${
              googleAdsAddress.pickUpAddress.streetName || ""
            }`.trim(),
            city: googleAdsAddress.pickUpAddress.city,
            region: googleAdsAddress.pickUpAddress.region,
            postCode: googleAdsAddress.pickUpAddress.postalCode,
          },
        });

        router.push("/form-submitted/thank-you");
        return;
      }

      setError(true);
    } catch (submitError) {
      console.error(submitError);
      setError(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box
      component="form"
      onSubmit={submitHandler}
      noValidate
      className={`${styles.formCard} ${className}`}
    >
      <Box className={styles.header}>
        <Typography variant="h4" component="h2" className={styles.title}>
          {title}
        </Typography>
        <Typography variant="body1" component="p" className={styles.subtitle}>
          {subtitle}
        </Typography>
      </Box>

      <Box className={styles.highlightBar}>
        <BoltIcon sx={{ fontSize: 18 }} />
        <Typography variant="subtitle1" component="p" color="white">
          {highlightText}
        </Typography>
      </Box>

      <Box className={styles.fields}>
        <Box className={styles.addressGrid}>
          {FORM_FIELDS.slice(0, 2).map((field) => (
            <GoogleAutocomplete
              key={field.id}
              label={field.label}
              value={formData[field.id]}
              onChange={(value) => handleChange(field.id, value)}
              onSelect={(selectedAddress) => {
                setFormData((prevData) => ({
                  ...prevData,
                  [field.id]: selectedAddress.formattedAddress,
                }));
                setGoogleAdsAddress((prevData) => ({
                  ...prevData,
                  [field.id]: selectedAddress.unformattedAddress,
                }));

                if (errors[field.id]) {
                  setErrors((prevErrors) => ({
                    ...prevErrors,
                    [field.id]: false,
                  }));
                }
              }}
              required={field.required}
              autoComplete="street-address"
              error={errors[field.id]}
              helperText={field.errorMessage}
            />
          ))}
        </Box>

        {FORM_FIELDS.slice(2).map((field) => (
          <Input
            key={field.id}
            lightTheme={true}
            label={field.required ? `${field.label}` : field.label}
            type={field.type}
            value={formData[field.id]}
            onChange={(value) => handleChange(field.id, value)}
            onBlur={() => handleBlur(field.id)}
            required={field.required}
            autoComplete={field.autoComplete}
            isInvalid={errors[field.id]}
            errorMessage={field.errorMessage}
            id={field.id}
          />
        ))}

        <Button
          type="submit"
          variant="contained"
          size="large"
          disabled={isLoading}
          className={styles.submitButton}
        >
          {submitButtonText}
        </Button>

        {showPhoneCta && phoneNumber ? (
          <Button
            variant="text"
            href={`tel:${phoneNumber}`}
            startIcon={<LocalPhoneIcon />}
            className={styles.phoneButton}
          >
            Prefer to talk? {phoneNumber}
          </Button>
        ) : null}

        <Divider className={styles.divider} />

        <Typography variant="body1" component="p" className={styles.footerNote}>
          {footerNote}
        </Typography>

        <Box className={styles.privacyNote}>
          <LockOutlinedIcon sx={{ fontSize: 18 }} />
          <Typography variant="body2" component="p">
            Your details are safe & never shared
          </Typography>
        </Box>

        {error ? (
          <Alert sx={{ marginTop: "16px" }} severity="error">
            Something went wrong. Please try again.
          </Alert>
        ) : null}
      </Box>
    </Box>
  );
}
