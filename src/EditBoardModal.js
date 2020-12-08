import React, { useEffect, useState } from "react";
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  FormGroup,
  Input,
  Label,
} from "reactstrap";

function EditBoardModal({ isOpen, toggle, size, totalBombs, handleSubmit }) {
  const [userTotalBombs, setUserTotalBombs] = useState(totalBombs);
  const [boardSize, setUserBoardSize] = useState(size);

  const onSizeChanged = (value) => {
    setUserBoardSize(value);
  };

  const onBombTotalChanged = (value) => {
    setUserTotalBombs(value);
  };

  return (
    <Modal isOpen={isOpen} toggle={() => toggle(false)}>
      <ModalHeader toggle={() => toggle(false)}>
        Rules for Minesweeper
      </ModalHeader>
      <ModalBody>
        <FormGroup>
          {/* <Label>Edit Board Size</Label>
          <Input
            defaultValue={size}
            type={"number"}
            onChange={(e) => onSizeChanged(parseInt(e.target.value))}
          /> */}
          <Label>Edit Bomb Total</Label>
          <Input
            defaultValue={totalBombs}
            type={"number"}
            onChange={(e) => onBombTotalChanged(parseInt(e.target.value))}
          />
        </FormGroup>
      </ModalBody>
      <ModalFooter>
        <Button
          color="success"
          onClick={() => {
            handleSubmit(userTotalBombs, boardSize);
            toggle(false);
          }}
        >
          Update
        </Button>{" "}
        <Button color="secondary" onClick={() => toggle(false)}>
          Close
        </Button>
      </ModalFooter>
    </Modal>
  );
}

export default EditBoardModal;
