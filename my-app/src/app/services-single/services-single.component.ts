import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router'

@Component({
  selector: 'app-services-single',
  templateUrl: './services-single.component.html',
  styleUrls: ['./services-single.component.css']
})
export class ServicesSingleComponent implements OnInit {
  serviceslist= [
    {id:"1",content:'We provide occupational therapy to improve a child’s fine motor skills and sensory issues. We have a dedicated and skilled occupational therapist who looks in the fine motor abilities and sensory issues of children enrolled, prepares child specific, tailor-made goals and work on it until the expected result is achieved.',name:"Occupational Therapy"},
    {id:"2",content:'The speech and language therapy service provided by Srimathi Karthikeyani School for Special Children includes assessment, intervention, home training, parental counselling, group therapy. An experienced and skilled Speech Language Pathologist works along with parents in delivering the therapy in a play way.  We provide Oromotor exercises, child language therapy, adult language therapy, voice therapy, fluency therapy, swallowing therapy, Alternative and Augmentative communication, phonological and phonetic training using different newly advanced techniques. ',name:"Speech and Language Therapy"},
    {id:"3",content:'We offer services to maintain and restore health through physiotherapy. The physical disability of children or adult is noted, their movement difficulties are observed, documented and customized rehabilitation plan is provided based on their needs, situation and goal. Neuro developmental therapy and gait therapy is primarily offered in our trust apart form other physical activities and therapy.',name:"Physio Therapy"},
    {id:"4",content:'Srimathi Karthikeyani School for Special Children provides a wholistic special education services right from age of three years until 14 years. We target that the children enrolled with us are joined in inclusive education. A set of teachers work along with children with special needs and strictly follows Individualized Educational Program.',name:"Special Education"},
    {id:"5",content:'We provide developmental and compulsory education for children to achieve their maximum level of competency in numeracy, literacy. The student who needs to fix their few lacking skills pertaining to reading, numeric and writing difficulties. Learning disability children and slow learners have shown great improvement through our remedial education.',name:"Remedial Education"},
    {id:"6",content:'We provide auditory verbal therapy a uni-sensory approach to the children with hearing impairment who are fitted with hearing aid.Children with processing disorders and perception disorders tend to exhibit deficit in auditory skills which eventually exhibit in their reading, language and social skills. Hence, a proper auditory perceptual analysis is done for children enrolled at our school and are given auditory training pertaining to auditory figure ground, auditory perception and processing skills. This is much unique to our center alone.',name:"Auditory Verbal Therapy"},
    {id:"7",content:'Yoga, Music and hydro therapy are provided as a part of healing and relaxation for children with special needs.',name:"Yoga, Music Therapy & Hydro Therapy"},
    {id:"8",content:'We provide naturopathy consultation based on parent’s preferences for the children enrolled in our school',name:"Naturopathy consultation"},
    {id:"9",content:'All the children and parents are provided with timely psychological consultation at Srimathi Karthikeyani School for Special Children and referred to the apt professional if needed.'+ 
    'We provide time to time counselling for the parents and children. Children’s memory training, socio cognitive behavior is mainly focused alongside with parental and family counselling.'  
    ,name:"Psychological Consultation & Counselling."},
    {id:"10",content:'We provide behavioral therapy for to children with problem behavior. It focuses on mainly improving specific behaviors as like social skills, communication skills, fine motor skills, reading and adaptive learning.',name:"Behaviour Therapy"}
  ]
  constructor(private route: ActivatedRoute) { }
  id: string
  singleservice:any=[];
  ngOnInit(): void {
    this.id=this.route.snapshot.params.id;
    this.singleservice=this.serviceslist.filter(e=>e.id==this.id);
  }

}
