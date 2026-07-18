import mongoose from "mongoose";

// fullname,email,mobile,location,github,linkedin,portfolio
export interface IPersonalInfo{
    fullname:string;
    email:string;
    mobile:string;
    location:string;
    github:string;
    linkedin:string;
    portfolio:string;
}
//company,position,startDate,endDate,description
export interface IWorkExperience{
    company:string;
    position:string;
    startDate:string;
    endDate:string;
    description:string;
}
//title,description,guthubUrl,liveurl,techstack
export interface IProject{
    title:string;
    description:string;
    githubUrl:string;
    liveUrl:string;
    techStack:string[];
}
// institution,degree,startDate,endDate
export interface IEducation{
    institution:string;
    degree:string;
    startDate:string;
    endDate:string;
}
// id,userid,title,summary,personalinfo,workExperience,projects,education,certifications
export interface IResume{
    _id?:string;
    user_id:mongoose.Types.ObjectId;
    title:string;
    summary:string;
    personalInfo:IPersonalInfo;
    workExperience?:IWorkExperience[];
    projects:IProject[];
    skills:string[];
    education:IEducation[];
    certifications?:string[];
    createdAt?:Date;
    updatedAt?:Date;
}
