import React from "react"
import clsx from "clsx";
import styles from "../../pages/index.module.css"
import Link from "@docusaurus/Link";
import { PageBlocksMission } from "@site/tina/__generated__/types";
import { TinaMarkdown } from "tinacms/dist/rich-text";
import { tinaField } from "tinacms/dist/react";

export default function MissionContainer(props: PageBlocksMission) {
    return (
        <div className={clsx(styles.missionContainer)}>
          <svg className={clsx(styles.missionIcon)} width="348" height="246" viewBox="0 0 348 246" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="119" cy="123" r="119" fill="#AAC6FD" fill-opacity="0.63"/>
            <path fill-rule="evenodd" clip-rule="evenodd" d="M150.778 136.6C140.161 27.9755 240.078 -13.1761 336.69 3.62438C340.824 4.34159 343.866 7.61672 344.463 11.529C353.248 64.9685 347.09 124.044 309.767 162.752C276.99 196.746 230.746 202.413 182.868 189.984C178.413 208.563 177.754 225.742 177.218 237.116C176.63 249.536 157.663 248.65 158.251 236.23C161.713 163.829 189.784 111.738 248.482 67.1478C229.36 70.9185 181.374 104.258 157.975 149.208C153.881 147.709 151.468 143.676 150.778 136.6Z" fill="#5DC597" fill-opacity="0.85"/>
          </svg>

          <div className={clsx(styles.infoDiv)} data-tina-field={tinaField(props, "text")}>
            <TinaMarkdown content={props.text} components={{
              h1: props => <h1 {...props} />,
              bold: props => <span {...props} />
            }}/>
            <Link className={styles.secondaryButton} to="/about">
              About us
            </Link>
          </div>
        </div>
    )
}