import React, { useEffect } from 'react';
import { useContext, useState } from 'react';
import NavbarInstance from './Navbar';
import { useParams } from 'react-router-dom';
import OrderContext from "../context/OrderContext";
import TeaContext from "../context/TeaContext";
import { useNavigate } from 'react-router-dom';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

function OrderItems(props) {
    const orderContext = useContext(OrderContext);
    const teaContext = useContext(TeaContext);

    let { orderId } = useParams();
    const navigate = useNavigate();
    const [orderItems,setOrderItems] = useState([]);
    const [teaTypes,setTeaTypes] = useState();
    const [brands,setBrands] = useState();
    const [packaging,setPackaging] = useState();
    const [places,setPlaces] = useState();
    const [orderItemDetails,setOrderItemDetails] = useState([]);

    useEffect(()=>{
        const getOrderItems = async() => {
            let customerId = JSON.parse(localStorage.getItem('customerId'));
            if(customerId){
                const orderItems = await orderContext.getOrderItems(customerId,orderId);
                console.log('getOrderItems',orderItems);
                setOrderItems(orderItems);
                console.log('orderItems',orderItems)

                let itemDetails = {};
                let totalCosts = 0;
                for(let item of orderItems){
                    let quantity = item.quantity;
                    let teaId = item.tea_id;
                    let teaName = item.tea.name;
                    let teaCost = item.tea.cost/100;
                    let eachTeaCosts = teaCost * quantity;
                    totalCosts += eachTeaCosts;
                    itemDetails[teaId] = {
                        name: teaName,
                        cost: teaCost,
                        quantity,
                        eachTeaCosts
                    }
                }

                itemDetails['totalCosts'] = totalCosts;
                console.log('ITEMS',itemDetails);
                setOrderItemDetails(itemDetails)

                const teaTypes = await teaContext.getAllTeaTypes();
                let teaTypeObject = {};
                for(let teaType of teaTypes){
                    teaTypeObject[teaType[0]] = teaType[1];
                };
                delete teaTypeObject[0];
                setTeaTypes(teaTypeObject);

                const brands = await teaContext.getAllTeaBrands();
                let brandObject = {};
                for(let brand of brands){
                    brandObject[brand[0]] = brand[1];
                };
                delete brandObject[0];
                setBrands(brandObject);

                const packaging = await teaContext.getAllPackaging();
                let packagingObject = {};
                for(let eachPackaging of packaging){
                    packagingObject[eachPackaging[0]] = eachPackaging[1];
                };
                delete packagingObject[0];
                setPackaging(packagingObject);

                const places = await teaContext.getAllPlaceOfOrigins();
                let placeObject = {};
                for(let place of places){
                    placeObject[place[0]] = place[1];
                };
                delete placeObject[0];
                setPlaces(placeObject);
                
                return orderItems;
            } else{
                console.log(`Login required to view past order's details`);
                navigate('/login');
            }
        }

        getOrderItems();
    },[])
    let count = 0;
    return (
        <React.Fragment>
            <div style={{minHeight:'100vh'}}>
                <div>
                    <NavbarInstance />
                </div>
                <div style={{height:'57px'}}></div>
                <div style={{ margin: '20px 20px 0px 20px' }}>
                    <div style={{margin:'20px 20px 0px 20px'}}>
                        <div style={{fontSize:'20px',fontFamily:'Khula,sans-serif',fontWeight:'700'}}>Order Id #{orderId} 
                            <span style={{fontSize:'20px',fontFamily:'Khula,sans-serif',fontWeight:'700',float:'right'}}>Total: S${orderItemDetails.totalCosts}</span>
                        </div>
                        <div style={{fontSize:'15px',fontFamily:'Khula,sans-serif'}}>
                        {orderItems.map(each => {
                            count = count + 1;
                            return(
                                <div key={each.id}>
                                    <Row>
                                        <Col>
                                        <table className='table'>
                                            <thead>
                                                <tr>
                                                    <th>
                                                    </th>
                                                    <th>
                                                    </th>
                                                    <th>

                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr>
                                                    <td style={{fontWeight:'600'}}>{count}.</td>
                                                    <td style={{fontWeight:'600'}}>Name:</td>
                                                    <td style={{fontWeight:'500'}}>
                                                        <div>{each.tea.name}</div>
                                                        <img src={each.tea.image_url} alt={each.tea.name} style={{height:'150px',width:'150px'}}/>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td></td>
                                                    <td style={{fontWeight:'600'}}>Brand:</td>
                                                    <td style={{fontWeight:'500'}}>{brands[each.tea.brand_id]}</td>
                                                </tr>
                                                <tr>
                                                    <td></td>
                                                    <td style={{fontWeight:'600'}}>Type/From:</td>
                                                    <td style={{fontWeight:'500'}}>{teaTypes[each.tea.tea_type_id]}, {places[each.tea.place_of_origin_id]}</td>
                                                </tr>
                                                <tr>
                                                    <td></td>
                                                    <td style={{fontWeight:'600'}}>Packaging:</td>
                                                    <td style={{fontWeight:'500'}}>{packaging[each.tea.packaging_id]} ( {each.tea.weight === 0? '': each.tea.weight+'g'} / {each.tea.sachet===0?'':each.tea.sachet+' sachets'} )</td>
                                                </tr>
                                                <tr>
                                                    <td></td>
                                                    <td style={{fontWeight:'600'}}>Cost x Quantity:</td>
                                                    <td style={{fontWeight:'500'}}>{each.tea.cost/100}     x     {each.quantity}</td>
                                                </tr>
                                                <tr>
                                                    <td></td>
                                                    <td style={{fontWeight:'600'}}>Subtotal:</td>
                                                    <td style={{fontWeight:'500'}}>S${orderItemDetails[each.tea.id].eachTeaCosts}</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                        </Col>
                                    </Row>
                                </div>
                            )
                        })}
                        </div>
                    </div>
                </div>
            </div>

        </React.Fragment>
    );
}

export default OrderItems;