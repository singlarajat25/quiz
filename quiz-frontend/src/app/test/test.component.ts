import { Component, OnInit } from '@angular/core';
import { Product} from '../Product ';
import { ApiService } from '../api.service';


@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.scss']
})
export class TestComponent implements OnInit {

 data: any;
 countries: any;
 questions: any;
 title: any;
 options: any;
 questionID: any;
 answerId: any;
 isCorrectlyorWrong: any;
 progressValue: any = 0 ;
 correctandincorrect: any;
 isAtempted: any;
 markes: any;
// data: Product[] = [];
isLoadingResults = true;
  constructor(private api: ApiService) { }

  ngOnInit() {
    this.api.getProducts()
    .subscribe(res => {
      this.data = res;
      console.log("Api Access Sucessfully");
      console.log(this.data);
      console.log(this.data.data);
      this.countries = this.data.data;
      this.isLoadingResults = false;
    }, err => {
      console.log('Api End Point Not working');
      console.log(err);
      this.isLoadingResults = false;
    });
  }

  submitAnswer(){
    let quesans = {
      questionId:this.questionID,
      	optionId: this.answerId
    }
    this.api.submit(quesans).
    subscribe(res =>{
           console.log("Api access sucessfully Response while send Ans")
           console.log(res.data)
           this.isCorrectlyorWrong = res.data.isAnsweredCorrectly
           {this.isCorrectlyorWrong == "true" ? this.correctandincorrect = ' Correct Answer ' : this.correctandincorrect = ' Incorrect answer '}
            this.progressValue = res.data.progress
            if (res.data.isAttempted == true || res.data.isAttempted == "true") {
              console.log("Insed is Attempted",res.data.isAttempted)
              this.isAtempted = false;
              }else{
                this.isAtempted = true
              }
    },err =>{
      console.log("Error to handle response")
    })
  }


  firstClick(data) {
    console.log('clicked', data._id);
    console.log("Question ID", this.questionID);
     this.answerId = data._id
    for (let myChild of this.options) {
      myChild.BackgroundColour = "white";
  }
  data.BackgroundColour = "green";
  }

  changeShape(shape) {
    this.correctandincorrect = ""
    console.log(shape.value);// Find Question ID here
    this.questionID = shape.value;
    this.api.getProduct(shape.value)
    .subscribe(res => {

      this.questions = res;
      console.log(" Api Access Sucessfully Get Questions By Id : ")
      console.log(this.questions);
      console.log(this.questions.data.title);
      if (this.questions.data.isAttempted == true || this.questions.data.isAttempted == "true") {
      this.isAtempted = false;
      // {this.isCorrectlyorWrong == "true" ? this.correctandincorrect = ' Correct Answer ' : this.correctandincorrect = ' Incorrect answer '}
      }else{
        this.isAtempted = true
      }
      this.title = this.questions.data.title;
      this.options = this.questions.data.options;
      this.markes = this.questions.data.marks;
      this.isLoadingResults = false;
    }, err => {

      console.log('Api End Point Not working');
      console.log(err);
      this.isLoadingResults = false;
    });

  }
}
