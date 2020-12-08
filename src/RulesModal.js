import React from "react";
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from "reactstrap";

function RulesModal({ isOpen, toggle }) {
  return (
    <Modal isOpen={isOpen} toggle={() => toggle(false)}>
      <ModalHeader toggle={() => toggle(false)}>
        Rules for Minesweeper
      </ModalHeader>
      <ModalBody>
        <ul>
          <li>
            This game of minesweeper is a 10x10 grid with 17 total bombs hidden
            inside.
          </li>
          <li>
            Left clicking on a square will either reveal that it is an empty
            square or contains a 💣
          </li>
          <li>
            Right clicking a square will put a 🚩 on that square. To remove the
            flag right click on the square again.
          </li>
          <li>
            Revealed squares without 💣's will display a number that indicates
            how many bombs are connected to that square. If the number is 0 it
            will display nothing.
          </li>
          <li>
            You can edit the total number of bombs in the grid using the 'Edit
            Board' button and clicking 'Update'
          </li>
        </ul>

        <h5>How to win or lose</h5>
        <ul>
          <li>In order to win you must uncover all non-💣 squares.</li>
          <li>
            Any time you click on a 💣 you will automatically lose the game.
          </li>
          <li>
            After winning or losing, click on the 'Play again' button to start
            the game over. Each new game will contain a new random board of
            hidden 💣's
          </li>
        </ul>
      </ModalBody>
      <ModalFooter>
        <Button color="secondary" onClick={() => toggle(false)}>
          Close
        </Button>
      </ModalFooter>
    </Modal>
  );
}

export default RulesModal;
