<?php
include("Dbconfig.php");

//recuperation des données sesies en html
$Mail = $_POST["mail"];
$Motdepasse1 = $_POST["mdp"];

//cryptage mdp
$grain='8h!6./?£*oµ5%z+°ù²#|G5';
$mdpcrypte = sha1(sha1($Motdepasse1).$grain);


try {

    //connexion bdd
    $bdd = new PDO ("mysql:host=$servername;dbname=$dbname",$user,$pass) ;
    $bdd->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION) ;
   echo "connexion ok !!";
    //requete sql
    foreach($bdd->query('SELECT Nom  FROM user WHERE Mail="'.$Mail.'" AND MDP="'.$mdpcrypte.'"' ) as $row){
    $nom = $row[0];
    
  }

if(($nom !=null)&&($email!=null)) 
{
    session_start();
    $_SESSION['connect']=0;
    $_SESSION['nom']=$nom;


    $bdd=null;
    header("location:pageMembre.html");
}else header("location:index.html");

 }
 catch (PDOException $erreur) {
    echo $erreur.' -- '.$erreur->getMessage();
}

