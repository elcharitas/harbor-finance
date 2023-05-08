import * as React from "react";
import { Flex, Text } from "@chakra-ui/react";
import { NavLink } from "src/components/nav-link";
import CONFIG from "src/configs";

export interface LogoProps {
  href?: string;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  width?: string;
  height?: string;
}

export const Logo: React.FC<LogoProps> = ({
  href = "/",
  onClick,
  width = "20px",
  height = "20px",
}) => {
  return (
    <Flex h="8" flexShrink="0" alignItems="flex-start">
      <NavLink
        p="1"
        display="flex"
        href={href}
        borderRadius="sm"
        onClick={onClick}
        gap="2"
        alignItems="center"
      >
        <svg
          height={height}
          width={width}
          version="1.1"
          id="_x32_"
          viewBox="0 0 512 512"
          xmlSpace="preserve"
        >
          <g id="SVGRepo_bgCarrier" strokeWidth={0} />
          <g
            id="SVGRepo_tracerCarrier"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <g id="SVGRepo_iconCarrier">
            <style
              type="text/css"
              dangerouslySetInnerHTML={{ __html: " .st0{fill:#fff;} " }}
            />
            <g>
              <path
                className="st0"
                d="M296.375,220.914c-30.714,0-57.626,16.242-72.64,40.606h145.273 C353.993,237.156,327.089,220.914,296.375,220.914z"
              />
              <path
                className="st0"
                d="M296.375,212.592c10.452,0,18.924-8.48,18.924-18.933c0-10.452-8.472-18.925-18.924-18.925 c-10.453,0-18.924,8.473-18.924,18.925C277.45,204.112,285.922,212.592,296.375,212.592z"
              />
              <path
                className="st0"
                d="M460.279,246.382c-42.244,3.459-58.478,38.526-63.266,50.866l-28.341-22.86H223.317 c-9.843,9.842-31.8,28.015-56.022,23.47c-24.23-4.537-60.784-66.934-93.88-73.434c-42.394-8.331-37.097,3.024-26.494,10.602 c5.807,4.153,29.335,34.908,67.376,82.516c51,63.826,90.846,105.995,177.908,105.995c48.552,0,89.309-32.344,109.587-57.083 c21.398,7.228,56.373,5.748,88.014-23.169C533.713,303.164,506.459,242.596,460.279,246.382z M469.378,320.926 c-17.094,15.624-33.471,18.9-44.199,18.9c-3.576,0-6.601-0.351-9.099-0.844c1.128-7.779,4.479-19.301,7.763-27.112 c0.192-0.46,0.376-0.927,0.542-1.388c7.654-21.055,20.562-32.46,38.368-33.922c0.552-0.042,1.094-0.066,1.629-0.066 c10.444,0,14.706,8.906,15.766,11.638C484.268,298.744,480.24,311,469.378,320.926z"
              />
              <path
                className="st0"
                d="M327.038,430.589c-11.129,2.624-22.801,4.153-34.833,4.153c-13.344,0-26.052-0.952-38.159-2.674 c-17.621,13.41-33.763,30.898-33.763,52.02h71.245h71.253C362.782,462.18,345.412,444.174,327.038,430.589z"
              />
              <path
                className="st0"
                d="M47.656,139.668c25.668-25.667,45.954,42.712,25.65,67.878c58.562-6.417,55.521-100.555,49.062-110.808 c-6.466-10.251-15.967,16.176-22.116,10.194c5.723-26.152-26.428-75.289-38.101-78.722c-11.68-3.443,7.462,23.486-32.109,55.954 c-45.486,37.323-37.665,98.984,12.266,123.95C46.587,210.253,21.989,165.335,47.656,139.668z"
              />
            </g>
          </g>
        </svg>
        <Text as="h3" fontWeight="bold">
          {CONFIG.APP.NAME}
        </Text>
      </NavLink>
    </Flex>
  );
};
