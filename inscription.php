<?php
include("Dbconfig.php");
//recujpération des donnée saisies en Html
$nom= $_POST['nom'];   //post recupératoion des donnée en version caché
$email= $_POST['mail'];
$mdp1= $_POST['mdp1'];
$mdp2= $_POST['mdp2'];


echo 'Nom :'.$nom.'<br>';
echo 'email :'.$email.'<br>';
echo 'mdp1 :'.$mdp1.'<br>';
echo 'mdp2 :'.$mdp2.'<br>';



if ($mdp1==$mdp2) {
//cryptage
//grain de sel
$grain="8h!Pw9DeR*@2"; //30 caractére environ
$mdp1crypte=sha1(sha1($mdp1).$grain); //double crypatge en rajoutant des caractére en plus 

echo 'mot de passe crypté :'.$mdp1crypte;


try {
echo 'connexion bdd ok <br/>';
$bdd = new PDO("mysql:host=$servername;dbname=$dbname",$user,$pass);
$bdd->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
echo'requete insertion ok <br/>';

$prepare=$bdd->prepare("INSERT INTO user(Nom,Mail,MDP)
 VALUES (:Nom, :Mail, :Mdp)");


$prepare->bindParam(':Nom',$nom); //associe attributs = donnée PHP
$prepare->bindParam(':Mail',$email);
$prepare->bindParam(':Mdp',$mdp1crypte);
$prepare->execute(); //execution de la requete 
echo 'insertion BDD reussie <br/>';
$bdd=null; //destruction de l'objet
header ('location:index.html');

}
catch(PDOException $erreur) {
    echo $erreur.'--'.$erreur->getMessage();
}    
}else 
 header('location:inscritpion.html'); 
// header permet de revenir à la page d'accueil en cas ou les 2mdps sont pas pareil