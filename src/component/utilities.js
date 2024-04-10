import { useState } from "react"
import { Form, Modal, Button } from 'react-bootstrap';

export const Course = ({ setFunction }) => {
    return (
        <Form.Select onChange={(e) => setFunction(e.target.value)}>
            <option value="">Course</option>
            <option value="BSCS">BSCS</option>
            <option value="BSIT">BSIT</option>
            <option value="BSHM">BSHM</option>
            <option value="BSTM">BSTM</option>
            <option value="DIT">DIT</option>
            <option value="DCST">DCST</option>
            <option value="DTMT">DTMT</option>
            <option value="DHRT">DHRT</option>
            <option value="BSBA - OM">BSBA - OM</option>
            <option value="BSBA - HRM">BSBA - HRM</option>
            <option value="BSBA - MM">BSBA - MM</option>
            <option value="BSBA - FM">BSBA - FM</option>
        </Form.Select>
    )
}

export const Year_Level = ({ setFunction }) => {
    return (
        <Form.Select onChange={(e) => setFunction(e.target.value)}>
            <option value="">Year Level</option>
            <option value="1st Year">1st Year</option>
            <option value="2nd Year">2nd Year</option>
            <option value="3rd Year">3rd Year</option>
            <option value="4th Year">4th Year</option>
        </Form.Select>
    )
}

export const updateMealData = (mealTicketList, userId, updatedData) => {
    return mealTicketList.map((user) => {
        if (user.id === userId) {
            return { ...user, ...updatedData };
        }
        return user;
    });
};

export const updateAlumniData = (alumniTicketList, userId, updatedData) => {
    return alumniTicketList.map((user) => {
        if (user.id === userId) {
            return { ...user, ...updatedData };
        }
        return user;
    });
};

export const GenericModal = ({ show, hide, title, message }) => {
    return (
        <Modal show={show} onHide={hide} centered>
            <Modal.Header closeButton>
                <Modal.Title>{title}</Modal.Title>
            </Modal.Header>
            <Modal.Body>{message}</Modal.Body>
            <Modal.Footer>
                <Button variant="primary" onClick={hide}>
                    Close
                </Button>
            </Modal.Footer>
        </Modal>
    );
};