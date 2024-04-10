import React, { useEffect, useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Footer } from "./home";
import { db } from '../config/firebase';
import { Container, Form, Navbar, Nav, Tabs, Tab, Modal, Row, Col, Card, CardHeader, CardBody, CardFooter, Button, Image } from 'react-bootstrap';
import { Course, Year_Level, GenericModal, updateMealData, updateAlumniData } from "./utilities";
import { getDocs, collection, doc, deleteDoc, getDoc, updateDoc } from 'firebase/firestore';

export const Admin = ({ handleLogout }) => {
    const [mealTicketList, setMealTicketList] = useState([]);
    const [alumniTicketList, setAlumniTicketList] = useState([]);
    window.localStorage.getItem('isLoggedIn', true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [mealTicketData, alumniTicketData] = await Promise.all([
                    getDocs(collection(db, "meal-ticket")),
                    getDocs(collection(db, "alumni-ticket")),
                ]);

                const filteredMealTicketData = mealTicketData.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
                const filteredAlumniTicketData = alumniTicketData.docs.map((doc) => ({ ...doc.data(), id: doc.id }));

                setMealTicketList(filteredMealTicketData);
                setAlumniTicketList(filteredAlumniTicketData);
            } catch (error) {
                console.log(error);
            }
        };

        fetchData();
    }, []);

    const updateMealTicketList = (newList) => setMealTicketList(newList);
    const updateAlumniTicketList = (newList) => setAlumniTicketList(newList);

    return (
        <>
            <AdminNavbar handleLogout={handleLogout}/>
            <Container className="d-flex justify-content-center align-items-center vh-100 bg-secondary" fluid>
                <Card style={{ minHeight: '95%', maxHeight: '95%', minWidth: '100%', maxWidth: '100%'}}>
                    <Tabs
                        fill
                    >
                        <Tab eventKey={"achiever"} title="Achiever's Night">
                            <Achiever
                                mealTicketList={mealTicketList}
                                updateMealTicketList={updateMealTicketList}
                            />
                        </Tab>
                        <Tab eventKey={"alumni"} title="Alumni's Night">
                            <Alumni
                                alumniTicketList={alumniTicketList}
                                updateAlumniTicketList={updateAlumniTicketList}
                            />
                        </Tab>
                    </Tabs>
                </Card>
            </Container>
            <Footer/>
        </>
    )
};

const AdminNavbar = ({ handleLogout }) => {
    return (  
      <div>
        <Navbar bg="light" text="white" expand="lg" sticky="top">
            <Container fluid>
                <Navbar.Brand className="d-flex align-items-center">
                    <Row>
                        <Col className="d-flex justify-content-center align-items-center">
                            <img src="/CBIT.png" 
                                width="50" height="50" 
                                className='d-inline-block align-top'
                            />
                        </Col>
                        <Col>
                            <div className="ml-3 d-flex flex-column align-items-start">
                                <div className="font-weight-bold">
                                    College of Business and Information Technology
                                </div>
                                <div className="font-weight-bold">
                                    QR Code Ticket
                                </div>
                            </div>
                        </Col>
                    </Row>
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav"  className="justify-content-end">
                    <Nav>
                        <Nav.Link as={Link} onClick={handleLogout}>Log out</Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
      </div>
    );
};

const Achiever = ({ mealTicketList, updateMealTicketList }) => {
    const [searchTerm, setSearchTerm] = useState("");
    const [course, setCourse] = useState("");
    const [yearLevel, setYearLevel] = useState("");
    
    const [deleteModal, setDeleteModal] = useState(false);
    const [paymentModal, setPaymentModal] = useState(false);
    const [selectedID, setSelectedID] = useState(null);


    const [messageModal, setMessageModal] = useState(false);
    const [messageTitle, setMessageTitle] = useState("");
    const [messageBody, setMessageBody] = useState("");

    const filteredMealTicket = useMemo(() => {
        let filteredData = mealTicketList.filter((student) => 
        `${student.first_Name} ${student.middle_Name} ${student.last_Name}`.toLowerCase().includes(searchTerm.toLowerCase())
        )

        if (course !== "") {
            filteredData = filteredData.filter((student) => 
            student.course === course
        );}

        if (yearLevel !== "") {
            filteredData = filteredData.filter((student) => 
            student.year_Level === yearLevel
        );}

        return filteredData;
    }, [mealTicketList, searchTerm, course, yearLevel]);


    const showDeleteModal = (id) => {
        setSelectedID(id);
        setDeleteModal(true);
    };

    const showPaymentModal = (id) => {
        setSelectedID(id);
        setPaymentModal(true);
    };

    const DeleteEntry = ({ show, hide, id, onUpdateMeal }) => {
        const deleteEntry = async (id) => {
            const ticketDoc = doc(db, "meal-ticket", id);
            await deleteDoc(ticketDoc);

            onUpdateMeal((prevUser) => prevUser.filter((student) => student.id !== id));
            
            hide();
            setSelectedID("");
            setMessageModal(true);
            setMessageTitle("Success");
            setMessageBody("The entry has been deleted");
        };
        
        
        return (
            <Modal show={show} onHide={hide} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Confirmation Window</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Are you sure you want to delete this entry?
                </Modal.Body>
                <Modal.Footer>
                    <Button variant='danger' onClick={() => deleteEntry(id)}>
                        Confirm
                    </Button>
                    <Button variant='light' onClick={hide}>
                        Cancel
                    </Button>
                </Modal.Footer>
            </Modal>
        );
    }

    const ConfirmPayment = ({ show, hide, id, onUpdateMeal }) => {
        const confirmPayment = async (id) => {
            try {
                const ticketDoc = doc(db, "meal-ticket", id);
                const mealSnapshot = await getDoc(ticketDoc);

                if (mealSnapshot.exists()) {
                    const currentPaymentStatus = mealSnapshot.data().payment_Status;

                    const newPaymentStatus = currentPaymentStatus === "Unpaid" ? "Paid" : "Unpaid";

                    await updateDoc(ticketDoc, {
                        payment_Status: newPaymentStatus
                    });

                    onUpdateMeal((prevUser) =>
                        prevUser.map((student) => {
                            if (student.id === id) {
                                return { ...student, payment_Status: newPaymentStatus };
                            }
                            return student;
                        })
                    );

                    hide();
                    setSelectedID(null);
                    setMessageModal(true);
                    setMessageTitle("Success");
                    setMessageBody("The entry has been updated");
                } else {
                    console.error("Document does not exist");
                }
            } catch (error) {
                console.error(error);
            }
        };

        return (
            <Modal show={show} onHide={hide} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Confirmation Window</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Are you sure you want to change this entry?
                </Modal.Body>
                <Modal.Footer>
                    <Button variant='danger' onClick={() => confirmPayment(id)}>
                        Confirm
                    </Button>
                    <Button variant='light' onClick={hide}>
                        Cancel
                    </Button>
                </Modal.Footer>
            </Modal>
        );
    }
    
    return (
        <Tab.Container className='bg-dark'>
            <CardHeader>
                <Navbar bg="light" text="white" expand="lg" sticky="top">
                    <Container fluid>
                        <Navbar.Brand className="d-flex align-items-center">
                            <strong>Student List</strong>
                        </Navbar.Brand>
                        <Row>
                            <Col>
                                <Form inline="true">
                                    <input
                                        className="form-control me-2 "
                                        type="text"
                                        placeholder="Search"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </Form>
                            </Col>
                            <Col>
                                <Course setFunction={setCourse}/>
                            </Col>
                            <Col>
                                <Year_Level setFunction={setYearLevel}/>
                            </Col>
                        </Row>
                    </Container>
                </Navbar>
            </CardHeader>
            <CardBody style={{ maxHeight: 'calc(100vh - 200px)', overflowY: 'auto' }}>
                {filteredMealTicket.length > 0 ? (
                    filteredMealTicket.sort((a, b) => {
                        const nameA = `${a.user_FirstName} ${a.user_MiddleName} ${a.user_LastName}`.toLowerCase();
                        const nameB = `${b.user_FirstName} ${b.user_MiddleName} ${b.user_LastName}`.toLowerCase();
                        
                            if (nameA < nameB) return -1;
                            if (nameA > nameB) return 1;
                        return 0;
                    }).map((student) => (
                        <>
                            <Card className='mb-3' key={student.id}>
                                <CardHeader>
                                    <Row>
                                        <Col className='mt-2 d-grid gap-2 d-md-flex justify-content-md-between'>
                                            <h6><strong>Student Number:</strong> {student.id}</h6>
                                        </Col>
                                        <Col className='mt-2 d-grid gap-2 d-md-flex justify-content-md-between'>
                                            <h6><strong>Payment Status:</strong> {student.payment_Status}</h6>
                                        </Col>
                                    </Row>
                                </CardHeader>
                                <CardBody>
                                    <Row>
                                        <Col className="d-grid gap-2 d-md-flex justify-content-md-between">
                                            <h6><strong>Name:</strong> {student.first_Name} {student.middle_Name} {student.last_Name}</h6>
                                        </Col>
                                        <Col className="d-grid gap-2 d-md-flex justify-content-md-between">
                                            <h6><strong>Course:</strong> {student.course}</h6>
                                        </Col>
                                        <Col className="d-grid gap-2 d-md-flex justify-content-md-between">
                                            <h6><strong>Year Level:</strong> {student.year_Level}</h6>
                                        </Col>
                                    </Row>
                                </CardBody>
                                <CardFooter>
                                    <div className="d-grid gap-2 d-md-flex justify-content-md-between">
                                        <Button variant='danger' onClick={() => showDeleteModal(student.id)}>Delete Entry</Button>
                                        <Button onClick={() => showPaymentModal(student.id)}>Confirm Payment</Button>
                                    </div>
                                </CardFooter>
                            </Card>
                            <DeleteEntry 
                                show={deleteModal} 
                                hide={() => setDeleteModal(false)} 
                                id={selectedID}
                                onUpdateMeal={updateMealTicketList}
                            />
                            <ConfirmPayment 
                                show={paymentModal} 
                                hide={() => setPaymentModal(false)} 
                                id={selectedID}
                                onUpdateMeal={updateMealTicketList}
                            />
                        </>
                    ))) : (
                    <div className="d-flex justify-content-center align-items-center" style={{ height: '340px' }}>
                        <h3>No record exists.</h3>
                    </div>
                )}
            </CardBody>
            <GenericModal show={messageModal} hide={() => setMessageModal(false)} title={messageTitle} message={messageBody}/>
        </Tab.Container>
    )
};

const Alumni = ({ alumniTicketList, updateAlumniTicketList }) => {
    return (
        <>
            <p>Alumni</p>
        </>
    )
};