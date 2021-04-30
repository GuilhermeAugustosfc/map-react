import React, { useEffect, useState } from "react";
import { Container, ButtonForm } from "./style";
import { Popover, Typography, makeStyles } from "@material-ui/core";
import { GoPlus, GoCheck, GoArrowLeft, GoTrashcan } from "react-icons/go";
import Button from "@material-ui/core/Button";
import api from "../../services/api";
import Swal from "sweetalert2";

const useStyles = makeStyles((theme) => ({
  typography: {
    padding: theme.spacing(2),
  },
}));

function BotaoForm(props) {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [descricao, setDescricao] = React.useState("");

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  function addNewOption(chave, url, callback) {
    let dados = new FormData();
    dados.append(chave, descricao);
    api.post(`http://f-agro-api.fulltrackapp.com/${url}`, dados, ({ data }) => {
      callback(data);
    });
  }

  function deleteOption(valor,  url, callback) {
    api.delete(`http://f-agro-api.fulltrackapp.com/${url}/${valor}`, {}, (data) => {
      callback(data);
    });
  }


  function removeItem(arr, refId, chave) {
    return arr.filter( ar => ar[`${chave}`] != refId);
  }
  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  return (
    <>
      <Container>
        {props.children}
        <ButtonForm corBotao={"#1dd86c"} onClick={handleClick}>
          <GoPlus size={20} />
        </ButtonForm>
        <ButtonForm corBotao={"#e2574c"} onClick={
          () => deleteOption(props.id, props.url, function(data){
            if (data.status) {
              Swal.fire(
                "Deletado !",
                "A opção foi deletada com sucesso.",
                "success"
              );
              props.states(removeItem(props.valor,props.id, props.chaveId))
            }else{
              Swal.fire(
                "Erro !",
                data.message,
                "warning"
              );
            }
          })
          }>
          <GoTrashcan size={20} />
        </ButtonForm>
      </Container>

      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
      >
        <Typography className={classes.typography}>
          <div>
            <div>
              <label> Adicione uma nova opção </label>
              <div>
                <input
                  onChange={(e) => setDescricao(e.target.value)}
                  type="text"
                  className="form-control"
                />
              </div>
            </div>
            <div
              style={{
                marginTop: "20px",
              }}
            >
              <Button
                variant="contained"
                size="small"
                style={{ marginRight: "10px", backgroundColor: "#16ff0026"}}
                id="btn-salvar-descricao"
                onClick={() =>
                  addNewOption(props.chaveDesc, props.url, function (data) {
                    props.states([
                      ...props.valor,
                      {
                        [`${props.chaveId}`]: data.id,
                        [`${props.chaveDesc}`]: descricao,
                      },
                    ]);

                    Swal.fire(
                      "Cadastrado !",
                      "A opção foi adicionada com sucesso.",
                      "success"
                    );
                    handleClose();
                  })
                }
                startIcon={<GoCheck />}
              >
                Adicionar
              </Button>

              <Button
                variant="contained"
                size="small"
                id="btn-cancelar"
                style={{ backgroundColor: "#ffa50038" }}
                onClick={handleClose}
                startIcon={<GoArrowLeft />}
              >
                Cancelar
              </Button>
            </div>
          </div>
        </Typography>
      </Popover>
    </>
  );
}

export default BotaoForm;
