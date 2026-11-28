/**
 * Splits ARIA naming and description attributes out of `$$restProps` so they
 * can be forwarded to an inner interactive element (such as a heading button)
 * while the remaining attributes stay on the outer wrapper element.
 *
 * @param {Record<string, any>} props
 */
export function splitAriaNaming(props) {
  const {
    "aria-label": ariaLabel,
    "aria-labelledby": ariaLabelledBy,
    "aria-describedby": ariaDescribedBy,
    ...rest
  } = props;

  return {
    ariaLabel,
    ariaLabelledBy,
    ariaDescribedBy,
    rest,
  };
}
