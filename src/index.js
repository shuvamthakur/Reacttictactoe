import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';


function Square(props) {
  const className= 'square' +(props.highlight ? ' highlight' : '');
      return (
        <button className={className} 
        onClick={props.onClick} >
          {props.value}
        </button>
      );
    }
  
  class Board extends React.Component {


    renderSquare(i) {
      const winLine=this.props.winLine;
      return (<Square value={this.props.squares[i]}
      onClick={()=>this.props.onClick(i)}
      highlight={winLine && winLine.includes(i)} />
      );
    }
  
    render() {
      const bSize =3;
      let squares =[];
      for(let i=0;i<bSize;++i){
        let row=[];
        for(let j=0;j<bSize;++j){
          row.push(this.renderSquare(i*bSize+j));
        }
        squares.push(<div key={i} classname="board-row">{row}</div>)
      }



      return (
        <div>
         {squares}
        </div>
      );
    }
  }
  
  class Game extends React.Component {
      constructor(props){
          super(props);
          this.state={
              history:[
                  {
                  squares: Array(9).fill(null),
              }
            ],
              stepNumber: 0,
              xIsNext:true,
          };
      }


      handleClick(i){
          const history=this.state.history.slice(0,this.state.stepNumber+1);
          const current=history[history.length-1];
        const squares=current.squares.slice();
        if(calculateWinner(squares).winner || squares[i]){

            return;
        }
        squares[i]=this.state.xIsNext ? 'X' : 'O';
        this.setState({
          history: history.concat([{
              squares: squares,
          }]),
          stepNumber: history.length,
          xIsNext:!this.state.xIsNext,
          });
    }

    jumpTo(step){
        this.setState({
            stepNumber:step,
            xIsNext: (step % 2)===0
        })
    }

    currentMove(step,move){
      if(move===0){
        return ' ';

      }
      const previous = this.state.history[move-1];
      const currentSquares = step.squares;
      let diff;
      for(var i=0;i<previous.squares.length;i++){
        if(previous.squares[i]!==currentSquares[i]){
          diff=i;
          break;
        }
        diff=null;
      }
      if (diff=== null){
        return "";
      }
      const humanReadablePos=diff+1;
      return "" + currentSquares[diff] + "->" +humanReadablePos;


    }




    render() {
        const history = this.state.history;
        const current = history[this.state.stepNumber];
        const winInfo=calculateWinner(current.squares);
        const winner= winInfo.winner;
        
        const moves=history.map((step,move)=>{
        const desc = move ?
            'go to move #' + this.currentMove(step,move) :
            'go to game start';
            return (
                <li key={move}>
                    <button className={move === this.state.stepNumber ? 'move-list-item-selected' : ''}
                    onClick={()=>this.jumpTo(move)}>{desc}
                    </button>
                </li>
            );
        });
        
        
        
        let status;
        if(winner){
            status="Winner" +winner;
        } else {
            status="Next player: " + (this.state.xIsNext ? 'X' : 'O');
        }

      return (
        <div className="game">
          <div className="game-board">
            <Board 
            squares={current.squares}
            onClick={(i)=> this.handleClick(i)}
            winLine={winInfo.line}
            />
          </div>
          <div className="game-info">
            <div>{status}</div>
            <ol>{moves}</ol>
          </div>
        </div>
      );
    }
  }
  
  // ========================================
  
  ReactDOM.render(
    <Game />,
    document.getElementById('root')
  );
  

  function calculateWinner(squares){
      const lines=[
          [0,1,2],
          [3,4,5],
          [6,7,8],
          [0,3,6],
          [1,4,7],
          [2,5,8],
          [0,4,8],
          [2,4,6],
      ];
      for(let i=0;i<lines.length;i++){
          const [a,b,c]=lines[i];
          if(squares[a] && squares[a] === squares[b] && squares[a]===squares[c]){
              return {
                winner:squares[a],
                line:lines[i]

              }
          }
      }
      return {
       winner: null
      };
  }