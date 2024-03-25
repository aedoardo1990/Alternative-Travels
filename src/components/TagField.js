import { useEffect, useState } from "react";

import Form from "react-bootstrap/Form";

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