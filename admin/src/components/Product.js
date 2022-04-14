import styled from "styled-components";
import React, { useState, useEffect } from "react";
import axios from "axios";
import Table from "@mui/material/Table";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import TextField from "@mui/material/TextField";
import InputLabel from "@mui/material/InputLabel";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import Box from "@mui/material/Box";
import SearchIcon from "@material-ui/icons/Search";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import { BodyContainer, Navbar, Content, Breadcrumb } from "./Navbar";

const AddForm = styled.form`
  height: 400px;
`;

const Product = () => {
  const [arrayData, setArrayData] = useState([]);
  const [currentId, setCurrentId] = useState("");
  const [changeArrayData, setChangeArrayData] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [open, setOpen] = useState(false);
  const [openDe, setOpenDe] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [currentSauceInfo, setCurrentSauceInfo] = useState();
  const [sauceInfo, setSauceInfo] = useState({
    tag: "",
    status: 0,
  });

  /*Tab*/

  const [value, setValue] = React.useState("1");

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleDeClickOpen = (id) => {
    setOpenDe(true);
    setCurrentId(id);
  };

  const handleDeClose = () => {
    setOpenDe(false);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleEditOpen = (id, tag) => {
    setOpenEdit(true);
    console.log(tag);
    setCurrentSauceInfo(tag);
    setCurrentId(id);
  };

  const handleEditClose = () => {
    setOpenEdit(false);
  };

  const url_Sauce = "http://140.125.45.167:8000/api/tag";
  
  let config = {
    headers: {
      "Content-Type": "application/json",
    },
    withCredentials: true,
  };

  useEffect(() => {
    const get_api = async () => {
      let { data } = await axios.get(url_Sauce, config);
      setArrayData(data);
      console.log(data);
      for (var i = 0; i < data.length; i++) {
        data[i].status === 0
          ? (data[i].status = "使用中")
          : (data[i].status = "已停用");
      }
      setChangeArrayData(data);
    };
    get_api();
  }, []);



  function handleSauceInfo(e) {
    const { value, name } = e.target;

    setSauceInfo((preData) => ({
      ...preData,
      [name]: value,
    }));
    console.log(sauceInfo);
  }

  const handleSubmit = async () => {
    try {
      await axios.post(url_Sauce, JSON.stringify(sauceInfo), config);

      window.location.reload();
    } catch (error) {
      console.log(error);
    }
  };

  const handleEditSubmit = async () => {
    try {
      await axios.put(
        url_Sauce + "/" + currentId,
        JSON.stringify(sauceInfo),
        config
      );
      window.location.reload();
    } catch (error) {
      console.log(error);
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(url_Sauce + "/" + currentId, config);
      window.location.reload();
    } catch (error) {
      console.log(error);
    }
  };

  function SearchOnChange(e) {
    setSearchInput(e.target.value);
  }

  const filtered = !searchInput
    ? arrayData
    : arrayData.filter((item) =>
        item.tag.toLowerCase().includes(searchInput.toLocaleLowerCase())
      );

  return (
    <>

      <BodyContainer>
        <Navbar />
        <Content>
          <Breadcrumb name="商品管理" />
          <Box sx={{ width: "100%", typography: "body1" }}>
          <TabContext value={value}>
            <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
              <TabList
                onChange={handleChange}
                aria-label="lab API tabs example"
              >
                <Tab label="調味料資訊" value="1" />
                <Tab label="商品資訊" value="2" />
              </TabList>
              <TabPanel value="2">

              <Box>
                  <Box sx={{ display: "flex", alignItems: "flex-end" }}>
                    <SearchIcon
                      sx={{ color: "action.active", mr: 1, my: 0.5 }}
                    />
                    <TextField
                      id="input-with-sx"
                      label="Search"
                      variant="standard"
                      type="search"
                      value={searchInput}
                      onChange={SearchOnChange}
                    />
                  </Box>
                </Box>

                <br />
                <Button
                  onClick={handleClickOpen}
                  variant="contained"
                  color="success"
                >
                  新增商品資訊
                </Button>
               

              </TabPanel>

              <TabPanel value="1">
                <Box>
                  <Box sx={{ display: "flex", alignItems: "flex-end" }}>
                    <SearchIcon
                      sx={{ color: "action.active", mr: 1, my: 0.5 }}
                    />
                    <TextField
                      id="input-with-sx"
                      label="Search"
                      variant="standard"
                      type="search"
                      value={searchInput}
                      onChange={SearchOnChange}
                    />
                  </Box>
                </Box>

                <br />
                <Button
                  onClick={handleClickOpen}
                  variant="contained"
                  color="success"
                >
                  新增調味料資訊
                </Button>
                <Dialog
                  open={open}
                  onClose={handleClose}
                  aria-labelledby="alert-dialog-title"
                  aria-describedby="alert-dialog-description"
                  onBackdropClick="false"
                >
                  <DialogTitle
                    id="alert-dialog-title"
                    style={{ textAlign: "center" }}
                  >
                    {"新增調味料資訊"}
                  </DialogTitle>

                  <AddForm
                    onSubmit={handleSubmit}
                    style={{ height: "280px", width: "350px" }}
                  >
                    <DialogContent>
                      <TextField
                        onChange={handleSauceInfo}
                        value={sauceInfo.tag}
                        name="tag"
                        label="調味料名稱"
                        variant="outlined"
                        sx={{ width: 300 }}
                      />
                      <br /> <br />
                      <InputLabel id="demo-simple-select-label">
                        狀態
                      </InputLabel>
                      <Select
                        onChange={handleSauceInfo}
                        value={sauceInfo.status}
                        name="status"
                        label="狀態"
                        sx={{ width: 300 }}
                        defaultValue={0}
                      >
                        <MenuItem value={0}>使用中</MenuItem>
                        <MenuItem value={1}>未使用</MenuItem>
                      </Select>
                      <br />
                      <br />
                    </DialogContent>
                    <DialogActions sx={{ height: 0 }}>
                      <Button onClick={handleClose}>取消</Button>
                      <Button type="submit" onClick={handleClose}>
                        確認
                      </Button>
                    </DialogActions>
                  </AddForm>
                </Dialog>

                <br />
                <br />
                <TableContainer component={Paper}>
                  <Table sx={{ minWidth: 850 }} aria-label="simple table">
                    <TableHead>
                      <TableRow>
                        <TableCell
                          align="center"
                          style={{
                            backgroundColor: "#6379A1",
                            color: "white",
                          }}
                        >
                          編號
                        </TableCell>

                        <TableCell
                          align="center"
                          style={{
                            backgroundColor: "#6379A1",
                            color: "white",
                          }}
                        >
                          調味料名稱
                        </TableCell>

                        <TableCell
                          align="center"
                          style={{
                            backgroundColor: "#6379A1",
                            color: "white",
                          }}
                        >
                          狀態
                        </TableCell>

                        <TableCell
                          align="center"
                          style={{
                            backgroundColor: "#6379A1",
                            color: "white",
                          }}
                        >
                          操作
                        </TableCell>
                      </TableRow>
                    </TableHead>

                    {filtered.map((item) => {
                      return (
                        <>
                          <TableRow
                            key={item.id}
                            sx={{
                              "&:last-child td, &:last-child th": { border: 0 },
                            }}
                          >
                            <TableCell
                              align="center"
                              component="th"
                              scope="item"
                            >
                              {item.id}
                            </TableCell>

                            <TableCell align="center">{item.tag}</TableCell>

                            <TableCell align="center">{item.status}</TableCell>

                            <TableCell align="center">
                              <Button
                                onClick={() => handleDeClickOpen(item.id)}
                              >
                                <DeleteIcon />
                              </Button>
                              <Button
                                onClick={() =>
                                  handleEditOpen(item.id, item.tag)
                                }
                              >
                                <EditIcon />
                              </Button>
                            </TableCell>
                          </TableRow>

                          <Dialog
                            open={openDe}
                            onClose={handleDeClose}
                            aria-labelledby="delete"
                            aria-describedby="delete"
                            onBackdropClick="false"
                            fullWidth="true"
                            maxWidth="xs"
                          >
                            <DialogTitle id="delete">
                              {"確定要刪除此項目?"}
                            </DialogTitle>
                            <DialogContent style={{textAlign:"right" }}>
                              <Button onClick={handleDeClose}>取消</Button>

                              <Button onClick={() => handleDelete()}>
                                確認
                              </Button>
                            </DialogContent>
                          </Dialog>

                          <Dialog
                            open={openEdit}
                            onClose={handleEditClose}
                            aria-labelledby="edit"
                            aria-describedby="edit"
                            onBackdropClick="false"
                            fullWidth="true"
                            maxWidth="xs"
                          >
                            <DialogTitle
                              id="edit"
                              style={{ textAlign: "center" }}
                            >
                              {"修改調味料資訊"}
                            </DialogTitle>

                            <AddForm style={{ height: "300px" }}>
                              <DialogContent>
                                <TextField
                                  defaultValue={currentSauceInfo}
                                  onChange={handleSauceInfo}
                                  name="tag"
                                  label="調味料名稱"
                                  variant="outlined"
                                  sx={{ width: 380 }}
                                />
                                <br /> <br />
                                <InputLabel id="edit">狀態</InputLabel>
                                <Select
                                  onChange={handleSauceInfo}
                                  value={0}
                                  name="status"
                                  label="狀態"
                                  sx={{ width: 380 }}
                                >
                                  <MenuItem value={0}>使用中</MenuItem>
                                  <MenuItem value={1}>未使用</MenuItem>
                                </Select>
                                <br />
                                <br />
                              </DialogContent>
                              <DialogActions sx={{ height: 40 }}>
                                <Button onClick={handleEditClose}>取消</Button>
                                <Button onClick={() => handleEditSubmit()}>
                                  確認
                                </Button>
                              </DialogActions>
                            </AddForm>
                          </Dialog>
                        </>
                      );
                    })}
                  </Table>
                </TableContainer>
              </TabPanel>
            </Box>
          </TabContext>
        </Box>
        </Content>
      </BodyContainer>
    </>
  );
};

export default Product;
