import { useEffect, useState } from "react";

import Form from "react-bootstrap/Form";
import Badge from "react-bootstrap/Badge";
import Popover from "react-bootstrap/Popover";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";

import styles from "../styles/TagField.module.css";

// Tag field instructions from: https://blog.logrocket.com/building-a-tag-input-field-component-for-react/
const TagField = ({ sendTags, showMessage, previousTags, currentTags }) => {
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState(previousTags?.length ? previousTags : currentTags);
  const [backspaceReleased, setBackspaceReleased] = useState(false);
  const [tagsChanged, setTagsChanged] = useState(false);

  useEffect(() => {
    if (tagsChanged) {
      sendTags(tags);
      setTagsChanged(false);
    }
  }, [tags, tagsChanged, sendTags]);

  const handleTagChange = (e) => {
    setTagInput(e.target.value);
  };

  const handleKeyDown = (e) => {
    const { key } = e;
    const trimmedInput = tagInput.trim().toLowerCase();

    if (key === ",") {
      e.preventDefault();
      if (tags.includes(trimmedInput)) {
        showMessage("warning", "Tag already exists!");
      } else if (tags.length === 15) {
        showMessage("warning", "Maximum number of tags reached!");
      } else if (trimmedInput) {
        setTags((prevState) => [...prevState, trimmedInput]);
        setTagInput("");
        setTagsChanged(true);
      }
    }

    if (key === "Backspace" && !tagInput.length && tags.length && backspaceReleased) {
      e.preventDefault();
      const tagsCopy = [...tags];
      const poppedTag = tagsCopy.pop();

      setTags(tagsCopy);
      setTagInput(poppedTag);
      setTagsChanged(true);
    }

    setBackspaceReleased(false);
  };

  const handleKeyUp = () => {
    setBackspaceReleased(true);
  };

  const deleteTag = (index) => {
    setTags((prevState) => prevState.filter((tag, i) => i !== index));
    setTagsChanged(true);
  };

  return (
    <Form.Group className="mb-3">
      <Form.Label>
        Tags
        <OverlayTrigger
          placement="top"
          overlay={
            <Popover id="tags-help">
              <Popover.Header as="h3">How to use tags</Popover.Header>
              <Popover.Body>
                <p>Tags are used to categorize sounds. You can provide up to 15 tags for each sound.</p>
                <p>
                  While it might be tempting to just use the origin of a sound as a tag (such as{" "}
                  <Badge bg="secondary">dog</Badge> or <Badge bg="secondary">car</Badge>) it is encouraged to use more
                  descriptive tags that describe the sound itself (such as <Badge bg="secondary">barking</Badge> or{" "}
                  <Badge bg="secondary">rumbling</Badge> or the mood/atmosphere of the sound (such as{" "}
                  <Badge bg="secondary">peaceful</Badge> or <Badge bg="secondary">noisy</Badge>).
                </p>
              </Popover.Body>
            </Popover>
          }
        >
          <Badge pill bg="secondary" className="ms-2">
            ?
          </Badge>
        </OverlayTrigger>
      </Form.Label>

      <div className={styles.TagList}>
        {tags.map((tag, index) => (
          <span className={styles.Tag} key={index}>
            {tag}
            <span title="Delete tag" onClick={() => deleteTag(index)}>
              <i className="fa-solid fa-square-xmark ms-1"></i>
            </span>
          </span>
        ))}
        <Form.Control
          className={styles.Input}
          type="text"
          placeholder="Enter tags as comma-separated values"
          name="tags"
          autoComplete="off"
          value={tagInput}
          onChange={handleTagChange}
          onKeyDown={handleKeyDown}
          onKeyUp={handleKeyUp}
        />
      </div>
    </Form.Group>
  );
};

export default TagField;