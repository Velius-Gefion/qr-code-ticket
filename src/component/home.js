import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Container, Navbar, Nav, CardGroup, Row, Col, Card, Form, FloatingLabel, InputGroup, CardHeader, CardBody, CardFooter, Button, Image,
Modal, ModalHeader, ModalBody, ModalFooter } from 'react-bootstrap';
import { Course, Year_Level } from "./utilities";
import { db } from '../config/firebase';
import { getDocs, collection, doc, getDoc, setDoc } from 'firebase/firestore';
import { QRCode } from 'react-qr-code';

export const Home = ({ isLoggedIn, setIsLoggedIn }) => {
    const [registerAchieverModal, setRegisterAchieverModal] = useState(false);
    const [registerAlumniModal, setRegisterAlumniModal] = useState(false);
    const [statusModal, setStatusModal] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if(isLoggedIn == true) {
            navigate("/admin");
        } else {
            navigate("/");
        }
    },[])

    const openRegisterAchiever = () => {
        setRegisterAchieverModal(true);
    }

    const openRegisterAlumni = () => {
        setRegisterAlumniModal(true);
    }

    const openStatus = () => {
        setStatusModal(true);
    }

    const closeModal = () => {
        setRegisterAchieverModal(false);
        setRegisterAlumniModal(false);
        setStatusModal(false);
    }

    const RegisterAchiever = ({ show, onHide }) => {
        const [studentNumber, setStudentNumber] = useState("");
        const [firstName, setFirstName] = useState("");
        const [middleName, setMiddleName] = useState("");
        const [lastName, setLastName] = useState("");
        const [course, setCourse] = useState("");
        const [yearLevel, setYearLevel] = useState("");

        const submit = async () => {
            const studentDocRef = doc(db, "meal-ticket", studentNumber);
            const docSnapshot = await getDoc(studentDocRef);

            if (docSnapshot.exists()) {
                alert("Student number already exists.");
                return;
            }

            const studentDetail = {
                first_Name: firstName,
                middle_Name: middleName,
                last_Name: lastName,
                course: course,
                year_Level: yearLevel,
                payment_Status: "Unpaid"
            }

            try {
                await setDoc(studentDocRef, studentDetail);

                setStudentNumber("");
                setFirstName("");
                setMiddleName("");
                setLastName("");
                setCourse("");
                setYearLevel("");
                onHide(); 
            } catch (err) {
                console.error(err);
            }
        }

        return (
            <Modal show={show} onHide={onHide} backdrop="static" keyboard={false} size='lg' centered>
                <ModalHeader closeButton>Register</ModalHeader>
                <ModalBody>
                    <FloatingLabel controlId="floatingPassword" label="Student Number">
                        <Form.Control className='mb-3' type="text" placeholder='Student Number' onChange={(e) => setStudentNumber(e.target.value)}/>
                    </FloatingLabel>
                    <InputGroup>
                        <FloatingLabel controlId="floatingPassword" label="First Name" onChange={(e) => setFirstName(e.target.value)}>
                            <Form.Control type="text" placeholder="First Name" />
                        </FloatingLabel>
                        <FloatingLabel controlId="floatingPassword" label="Middle Name" onChange={(e) => setMiddleName(e.target.value)}>
                            <Form.Control type="text" placeholder="Middle Name" />
                        </FloatingLabel>
                        <FloatingLabel controlId="floatingPassword" label="Last Name" onChange={(e) => setLastName(e.target.value)}>
                            <Form.Control type="text" placeholder="Last Name" />
                        </FloatingLabel>
                    </InputGroup>
                    <Row className='mt-3'>
                        <Col>
                            <Course setFunction={setCourse}/>
                        </Col>
                        <Col>
                            <Year_Level setFunction={setYearLevel}/>
                        </Col>
                    </Row>
                </ModalBody>
                <ModalFooter>
                    <Button onClick={submit}>Submit</Button>
                </ModalFooter>
            </Modal>
        )
    }

    const Status = ({ show, onHide }) => {
        const [studentNumber, setStudentNumber] = useState("");
        const [studentDetails, setStudentDetails] = useState("");
        const [paymentStatus, setPaymentStatus] = useState(false);
        
        const submit = async () => {
            if (studentNumber === "") {
                alert("Please input your student number.");
                return;
            }

            const studentDocRef = doc(db, "meal-ticket", studentNumber);
            const docSnapshot = await getDoc(studentDocRef);

            if (!docSnapshot.exists()) {
                alert("Student number doesn't exists.");
                return;
            }

            if (docSnapshot.data().payment_Status === "Paid") {
                setPaymentStatus(true);
            }
            
            setStudentDetails(
                "Name: " + docSnapshot.data().first_Name + " " + docSnapshot.data().middle_Name + " " + docSnapshot.data().last_Name +
                "\nCourse: " + docSnapshot.data().course + "\nYear Level: " + docSnapshot.data().year_Level +
                "\nPayment Status: " + docSnapshot.data().payment_Status
            );
        }

        return (
            <Modal show={show} onHide={onHide} backdrop="static" keyboard={false} centered>
                <ModalHeader closeButton>Meal Ticket Status</ModalHeader>
                <ModalBody>
                    <FloatingLabel controlId="floatingPassword" label="Student Number">
                        <Form.Control className='mb-3' type="text" placeholder='Student Number' onChange={(e) => setStudentNumber(e.target.value)}/>
                    </FloatingLabel>
                    {studentDetails !== "" && paymentStatus == true && (
                        <div className='text-center'>
                            <h5 className='mb-4'>Please take a screenshot of your QR Code</h5>

                            <QRCode value={studentDetails}/>
                        </div>
                    ) || studentDetails !== "" && paymentStatus == false && (
                        <div>
                            <h5 className='text-center'>Your ticket hasn't been confirmed yet. <br/>Please pay the fee if you haven't paid yet</h5>
                        </div>
                    )}
                </ModalBody>
                <ModalFooter>
                    <Button onClick={submit}>Submit</Button>
                </ModalFooter>
            </Modal>
        )
    }

    const RegisterAlumni = ({ show, onHide }) => {
        const submit = async () => {
            onHide();
        }

        return (
            <Modal show={show} onHide={onHide} backdrop="static" keyboard={false} size='lg' centered>
                <ModalHeader closeButton>Register</ModalHeader>
                <ModalBody>
                    <h1>Not functional ATM</h1>
                </ModalBody>
                <ModalFooter>
                    <Button onClick={submit}>Submit</Button>
                </ModalFooter>
            </Modal>
        )
    }

    return (
        <>
            <CustomNavbar setIsLoggedIn={setIsLoggedIn}/>
            <Container className="d-flex justify-content-center align-items-center vh-50 bg-secondary" style={{ minHeight: '500px' }} fluid>
                <CardGroup>
                    <Card className='mt-3 mb-3'>
                        <CardBody>
                            <Image src="achiever.png" fluid/>
                        </CardBody>
                        <CardFooter>
                            <Row>
                                <Col>
                                    <Button onClick={openRegisterAchiever}>Register to<br/>Achiever's Night</Button>
                                </Col>
                                <Col>
                                    <Button onClick={openStatus}>Check Your<br/>Ticket Status</Button>
                                </Col>
                            </Row>
                        </CardFooter>
                    </Card>
                    <Card className='mt-3 mb-3'>
                        <CardBody>
                            <Image src="alumnight.png" fluid/>
                        </CardBody>
                        <CardFooter>
                            <Button onClick={openRegisterAlumni}>Register to<br/>Alumni Night</Button>
                        </CardFooter>
                    </Card>
                </CardGroup>
            </Container>
            <Footer/>
            <RegisterAchiever show={registerAchieverModal} onHide={closeModal}/>
            <RegisterAlumni show={registerAlumniModal} onHide={closeModal}/>
            <Status show={statusModal} onHide={closeModal}/>
        </>
    )
};

const CustomNavbar = ({ setIsLoggedIn }) => {
    const [loginModal, setLoginModal] = useState(false);

    const openModal = () => {
        setLoginModal(true);
    };
    
    const closeModal = () => {
        setLoginModal(false);
    };

    return (  
        <>
            <Navbar bg="light" text="white" expand="lg" sticky="top">
                <Container fluid>
                    <Navbar.Brand className="d-flex align-items-center" onClick={openModal}>
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
                </Container>
            </Navbar>
            <Login show={loginModal} onHide={closeModal} setIsLoggedIn={setIsLoggedIn}/>
        </>
    );
};

const Login = ({ show, onHide, setIsLoggedIn}) => {
    const navigate = useNavigate();
    const [password, setPassword] = useState("");

    const login = async (password) => {
        try {
            const accessRef = collection(db, 'access');
            const accessSnapshot = await getDocs(accessRef);

            let passwordMatched = false;

            accessSnapshot.forEach((doc) => {
                const accessData = doc.data();
                console.log(accessData);
                if (accessData.password === password) {
                    passwordMatched = true;
                    window.localStorage.setItem('isLoggedIn', true);
                    setIsLoggedIn(true);
                    navigate('/admin');
                }
            });
            
            if (!passwordMatched) {
                alert("Invalid Password");
            }
        } catch (error) {
            console.error('Error checking access code:', error);
        }
    }

    const handleLogin = () => {
        login(password);
    }


    return (
        <Modal show={show} onHide={onHide} centered>
            <ModalHeader closeButton>Admin Login</ModalHeader>
            <ModalBody>
                <FloatingLabel controlId="floatingPassword" label="Password">
                    <Form.Control type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)}/>
                </FloatingLabel>
            </ModalBody>
            <ModalFooter>
                <Button onClick={handleLogin}>Log in</Button>
            </ModalFooter>
        </Modal>
    )
}

export const Footer = () => {

    return (
        <footer className='bg-dark text-light py-3'>
            <Container className='text-center'>
                <h5 className='mt-3 mb-4'>SJIT CBIT QR Code Ticket</h5>
                <p className='mt-2 mb-2'>Created by Cyril Dominic P. Cataraja</p>
                <p className='mt-2 mb-2'>Graphics by Francis Bernard Con-ui & Lance Montenegro</p>
                <p className='mt-2 mb-2'>Copyright © 2024 - Cyril Dominic P. Cataraja - All Rights Reserved.</p>
            </Container>
        </footer>
    )
}