import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {NavigationTitle,MasterCodes,Filter as Filterer} from 'Redux/Actions';
import { Paper, Table, TableHead, TableRow, TableCell, TableBody, TableFooter, Button, TablePagination, Dialog, CircularProgress, DialogContent } from '@material-ui/core';
import TablePaginationActions from '@material-ui/core/TablePagination/TablePaginationActions';
import Skeleton from '@material-ui/lab/Skeleton';
import Filter from './Filter';
import Add from './Add';
import Edit from './Edit';
import { useSnackbar } from 'notistack';
import { Requests } from '../../../Services';
import { Close, CloudUpload } from '@material-ui/icons';
import Upload from 'Components/Upload';



const Summary = (props:any) => {

    const dispatch = useDispatch();
    const masterCode = useSelector( (state:any) => state.MasterCodes.data );
    const masterCodesRequest:any = React.useRef();
    const [upload,setUpload] = React.useState(false);

    const { enqueueSnackbar, closeSnackbar } = useSnackbar(); //snackbar    
    const [ params, setParams] = React.useState({page:1,per_page:10});
    const [filter, setFilter] = React.useState({
        product_code     : {filter:'iet',key:''},
        product_name     : {filter:'iet',key:''},
        category         : {filter:'iet',key:''},
    });
    const [ open, setOpen ] = React.useState(false);
    
    
    // const [ upload,setUpload ] = React.useState({ 
    //     uploading   : false,
    //     open       : false,
    //     result    : [], 
    // });

    React.useEffect(()=>{
        dispatch(MasterCodes());
        dispatch(NavigationTitle({control:"product_master_file_maintenance"}));

        window.addEventListener('scroll', scroll, true);
        return () =>{
            window.removeEventListener('scroll', scroll);
        }
    },[]);


    const scroll = () => {
        let scrollY = window.scrollY;
        let selector:any = window.document.getElementsByClassName('sticky-header');
        const changeAll = (style:string) => {
            for(var i = 0;i<selector.length;i++){
                
                if(style !== '0px'){
                    selector[i].style.background = '#3f50b5';
                    selector[i].style.color = 'white';
                }else{
                    selector[i].style.background = 'white';
                    selector[i].style.color = 'unset';
                }

                selector[i].style.top = style;
            }
        }
        if(scrollY > 92){
            changeAll(scrollY - 92 + 'px');
        }else{
            changeAll('0px');
        }
    }




    let file:HTMLInputElement;

    const togglePointerEvents = (event:boolean) => {
        if(event){
            document.getElementsByTagName("html")[0].style.pointerEvents = "unset";
            document.getElementsByTagName("html")[0].style.cursor = "unset";
        }else{
            document.getElementsByTagName("html")[0].style.pointerEvents = "none";
            document.getElementsByTagName("html")[0].style.cursor = "progress";
        }
        return;
    }

    const actions = (key:any) => (
        <Button onClick={() => { closeSnackbar(key) }}>
            <div style={{color:"white"}}><Close /></div>
        </Button>
    );

    // const uploadFile = () => {
    //     togglePointerEvents(false);
    //     if(file.files.length !== 0){
    //         const selectedFile = file.files[0];
    //         let filename = selectedFile.name.split('.').pop();
            
    //         if( !(filename === 'xls' || filename === 'xlsx')) {
    //             enqueueSnackbar('Please select xlsx or xls file only !!!. ',{variant:'error',action:actions});
    //             togglePointerEvents(true);
    //             return;
    //         }else{
    //             // uploadSheet(selectedFile);
    //         }
    //     }
    // }


    // const uploadFileModal = () =>{
    //     if(upload.uploading){
    //         return (
    //             <Dialog
    //                 maxWidth="xs"
    //                 open={upload.uploading}
    //                 disableBackdropClick
    //                 className="uploading-processing"
    //             >
    //                 <DialogContent>
    //                     <div>
    //                         <div className="loading-submit-upload" style={{textAlign:"center"}}>
    //                             <CircularProgress />
    //                         </div>
    //                         <div className="status-submit-upload">
    //                             Uploading
    //                         </div>
    //                     </div>
    //                 </DialogContent>
    //             </Dialog>
    //         );
    //     }else{
    //         return null;
    //     }
    // }


    /**********************/




    //************** for edit

    const [input, setInput] = React.useState({
        id           : '',
        product_code : '',
        product_name : '',
        category     : '',
    });
    const [openEdit, setOpenEdit] = React.useState(false);

    const handleEdit = () => {
        setOpenEdit(!openEdit)
    }

    //**************



    React.useEffect(()=>{
        dispatch(NavigationTitle({title : 'Product Master File Maintenance',control:"product_master_file_maintenance"}));
        dispatch(Filterer(filter,"master",params));
        
        // return () => {
        //     dispatch(NavigationTitle(''));
        // }
    },[])

    const handleAdd = () => {
        setOpen(!open);
    }


    const handleChangePage = (event: React.MouseEvent<HTMLButtonElement, MouseEvent> | null,newPage: number,) =>{
        // setPage(newPage);

        let pams:any = params;
        params.page=newPage+1;
        setParams(pams);

        dispatch(Filterer(filter,"master",pams));
    }

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        const val:any = event.target.value;
        let paran = {page:1,per_page:val};
        setParams(paran);
        dispatch(Filterer(filter,"master",paran));
    };

    const initEdit = (a:any) => {

        setInput({
            id : a.id,
            product_code : a.product_code,
            product_name : a.product_name,
            category : a.category.id
        });
        setOpenEdit(true);
    }



    const skeletonTable = () => {
        let a:any = [];

        const tableCell = <TableCell align="center"><Skeleton variant="rect" /></TableCell>;
        for(let i = 0;i < 10;i++ ){
            a.push(
                <TableRow key={i}>
                    {tableCell}
                    {tableCell}
                    {tableCell}
                </TableRow>
            );
        }
        return a;
    }
    
    return(
        <React.Fragment>
            <Requests.MasterCodes request={masterCodesRequest} />
            <Add open={open} handleClose={handleAdd}/>
            <Edit open={openEdit} handleClose={handleEdit} per_page={params.per_page} page={params.page}  input = {input} setInput = {setInput}/>
           
            <Upload
                open      = {upload}
                setOpen   = {setUpload}
                type      = "masterfile"
            />
            
            
            <Paper className="paper-table">
                <div className="header">
                    <div className="title">Product Maintenance</div>
                </div>
                <div className="custom-table">
                    <Table size="small">
                        <TableHead>
                            <TableRow>
                                <TableCell className="sticky-header" align="left">Product Code</TableCell>
                                <TableCell className="sticky-header" align="left">Product Name</TableCell>
                                <TableCell className="sticky-header" align="left">Category</TableCell>
                            </TableRow>
                        </TableHead>
                        
                        <TableBody>
                            {
                                masterCode ?
                                    masterCode.data.data.map((key:any,id:number)=>(
                                        <TableRow key={id}  hover={true} style={{cursor:'pointer'}} onDoubleClick={() => initEdit(key)} >
                                            <TableCell align="left" title={key.product_code}>{key.product_code}</TableCell>
                                            <TableCell align="left" title={key.product_name}>{key.product_name}</TableCell>
                                            <TableCell align="left" title={key.category}>{key.category.name}</TableCell>
                                        </TableRow>
                                    ))
                                :   
                                skeletonTable()
                            }
                        </TableBody>
                    </Table>
                </div>
                <div className="footer">
                    <Button onClick={ () => handleAdd()} variant="contained" color="primary" className="product-add-new">
                        ADD NEW
                    </Button>
                    
    
                    <Button 
                        color="primary"
                        variant="contained"
                        onClick={(event)=>{
                            setUpload(true);
                        }}
                        className = "product-add-file"
                    >
                        <CloudUpload />&nbsp;  
                        Import file
                    </Button>
                    <table>
                        <tbody>
                            <tr>

                                <TablePagination
                                    rowsPerPageOptions={[10,25,50,100]}
                                    colSpan={0}
                                    count={masterCode ? masterCode.data.meta.total : 10}
                                    rowsPerPage={params.per_page}
                                    page={masterCode ? params.page-1 : 0}
                                    onChangePage={handleChangePage}
                                    onChangeRowsPerPage={handleChangeRowsPerPage}
                                    ActionsComponent={TablePaginationActions}
                                    className="product-pagination"
                                />
                            </tr>
                        </tbody>
                    </table>
                </div>
            </Paper>
        </React.Fragment>
    );

}

export default Summary;