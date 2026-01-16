/* eslint-disable prettier/prettier */
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import coreStyle from "sass-boilerplate/stylesheets/style.module.scss";
import settingsStyle from "sass-boilerplate/stylesheets/components/wall/PersonalnformationSettings.module.scss";

/**
 * Molecule component used to render email chip list
 * @param emails
 * @param removeEmail
 * @constructor
 */
const EmailList = ({ emails, removeEmail }) => (
  <div className={settingsStyle.chipEmail}>
    {!!emails.length &&
      emails.map((email, index) => (
        <div key={index} className={coreStyle.chip}>
          {email}
          <span className={coreStyle.deleteChip} onClick={() => removeEmail(email)}>
            <FontAwesomeIcon icon={faTimes} />
          </span>
        </div>
      ))}
  </div>
);

export default EmailList;
